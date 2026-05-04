import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function getOplrunPath(): string {
    const config = vscode.workspace.getConfiguration('cplex-opl');
    const customPath = config.get<string>('oplrunPath');

    if (customPath && customPath.trim() !== '') {
        return customPath;
    }

    // Try CPLEX_STUDIO_DIR environment variable
    const cplexDir = process.env['CPLEX_STUDIO_DIR'];
    if (cplexDir) {
        const envPath = path.join(cplexDir, 'opl', 'bin', 'x64_win64', 'oplrun.exe');
        if (fs.existsSync(envPath)) {
            return envPath;
        }
    }

    // Common Windows installation paths heuristics
    const programFiles = process.env['ProgramW6432'] || process.env['ProgramFiles'] || 'C:\\Program Files';
    const ilogDir = path.join(programFiles, 'IBM', 'ILOG');
    
    if (fs.existsSync(ilogDir)) {
        const subdirs = fs.readdirSync(ilogDir);
        // Find the latest CPLEX_Studio directory
        const studioDirs = subdirs.filter(d => d.startsWith('CPLEX_Studio')).sort().reverse();
        for (const dir of studioDirs) {
            const potentialPath = path.join(ilogDir, dir, 'opl', 'bin', 'x64_win64', 'oplrun.exe');
            if (fs.existsSync(potentialPath)) {
                return potentialPath;
            }
        }
    }

    // Fallback to expecting it in system PATH
    return 'oplrun';
}
