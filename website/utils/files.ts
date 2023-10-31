import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { basename, dirname, join, resolve } from 'path';
import fileExtension from 'file-extension';

export const getRootPath = () => resolve(process.cwd());

export const validatePath = (pathToValidate: string, type: 'file' | 'folder' | 'any' = 'any') =>
    existsSync(pathToValidate) &&
    (type !== 'any'
        ? type === 'file'
            ? statSync(pathToValidate).isFile()
            : statSync(pathToValidate).isDirectory()
        : true);

const getAllFolders = (
    dirPath: string,
    getContentOfFiles?: boolean,
    folder: Folder = { name: '', path: '' },
): Folder => {
    const files = readdirSync(folder.path !== '' ? folder.path ?? dirPath : dirPath);
    const filesArray: File[] = [];
    const foldersArray: Folder[] = [];

    files.forEach(f => {
        if (statSync(`${dirPath}/${f}`).isDirectory()) {
            foldersArray.push(getAllFolders(join(dirPath, f), getContentOfFiles, { name: f, path: join(dirPath, f) }));
        } else {
            filesArray.push({
                path: dirPath,
                name: f,
                extension: fileExtension(f) as string,
                content: getContentOfFiles ? readFileSync(join(dirPath, f), 'utf8') : null,
            });
        }
    });

    if (folder) {
        folder.files = filesArray;
        folder.folders = foldersArray;
    }

    if (folder.path === '') {
        folder.name = basename(dirPath);
        folder.path = dirPath;
    }

    return folder;
};

export function getAllContentOfFolder(folderPath: string, getContentOfFiles?: boolean) {
    return validatePath(folderPath, 'folder') ? getAllFolders(folderPath, getContentOfFiles) : null;
}

export function getContentOfFolderOrFile(dirPath: string, getContentOfFiles?: boolean): Folder | File | null {
    if (!validatePath(dirPath, 'any')) {
        return null;
    }

    if (statSync(dirPath).isFile()) {
        return {
            name: basename(dirPath),
            extension: fileExtension(basename(dirPath)) as string,
            path: dirPath,
            content: readFileSync(dirPath, 'utf8'),
        } as File;
    }

    const filesArray: File[] = [];
    const foldersArray: Folder[] = [];

    const content = readdirSync(dirPath);

    content.forEach(f => {
        if (statSync(`${dirPath.endsWith('\\') ? dirPath.slice(0, -1) : dirPath}\\${f}`).isDirectory()) {
            let processedName = f.startsWith('.') ? f.slice(1) : f;
            if (processedName === 'node_modules') {
                processedName = 'node';
            }

            if (processedName === 'data') {
                processedName = 'database';
            }

            if (processedName === 'types') {
                processedName = 'typescript';
            }

            if (
                processedName.endsWith('s') &&
                processedName.charAt(processedName.length - 2) !== 's' &&
                processedName !== 'packages' &&
                processedName !== 'scripts' &&
                processedName !== 'utils'
            ) {
                processedName = processedName.slice(0, -1);
            }

            foldersArray.push({
                name: f,
                path: join(dirPath, f),
            });
            return;
        }

        filesArray.push({
            path: dirPath,
            name: f,
            extension: fileExtension(f) as string,
            content: getContentOfFiles ? readFileSync(join(dirPath, f), 'utf8') : null,
        });
    });

    return {
        name: basename(dirPath),
        path: dirPath,
        files: filesArray,
        folders: foldersArray,
    };
}

export function createAndWriteFile(filePath: string, data: string | NodeJS.ArrayBufferView) {
    if (process.platform !== 'win32') {
        filePath = resolve(filePath.replaceAll('\\', '/'));
    }
    const paths = ['/', ...dirname(filePath).split('/')];

    paths.reduce((acc, curr) => {
        const actualPath = join(acc, curr);
        if (!validatePath(actualPath, 'folder')) {
            mkdirSync(actualPath);
        }

        return actualPath;
    });

    writeFileSync(filePath, data);
}

export async function downloadFile(url: string, filePath: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    createAndWriteFile(filePath, buffer);
}

export interface Folder {
    path: string;
    name: string;
    folders?: Folder[];
    files?: File[];
}

export interface File {
    name: string;
    extension: string;
    path?: string;
    content?: string | null;
}
