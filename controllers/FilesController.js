const FilesController = {
    createFile: async (req, res) => {
        try {
            // Retrieve the user based on the token
            const user = await getUserFromToken(req);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Extract the required parameters from the request body
            const { name, type, data, parentId, isPublic } = req.body;

            // Check if the name parameter is missing
            if (!name) {
                return res.status(400).json({ error: 'Missing name' });
            }

            // Check if the type parameter is missing or not valid
            if (!type || !['folder', 'file', 'image'].includes(type)) {
                return res.status(400).json({ error: 'Missing or invalid type' });
            }

            // Check if the data parameter is missing for non-folder types
            if (type !== 'folder' && !data) {
                return res.status(400).json({ error: 'Missing data' });
            }

            // Check if the parentId is set
            if (parentId) {
                const parentFile = await getFileFromDB(parentId);
                if (!parentFile) {
                    return res.status(400).json({ error: 'Parent not found' });
                }
                if (parentFile.type !== 'folder') {
                    return res.status(400).json({ error: 'Parent is not a folder' });
                }
            }

            // Generate a unique filename using UUID
            const filename = uuidv4();

            // Define the storing folder path
            const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

            // Create the storing folder if it doesn't exist
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            // Create the local path for the file
            const localPath = path.join(folderPath, filename);

            // Store the file in clear (Base64) in the local path
            fs.writeFileSync(localPath, Buffer.from(data, 'base64'));

            // Create a new file document in the collection
            const newFile = {
                userId: user._id,
                name,
                type,
                isPublic: isPublic || false,
                parentId: parentId || 0,
                localPath
            };

            // Save the new file document in the DB
            const savedFile = await saveFileToDB(newFile);

            // Return the new file with a status code 201
            return res.status(201).json(savedFile);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
