import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

console.log('Building Psybox Physics Engine...');

try {
    // TypeScript 컴파일
    execSync('tsc', { stdio: 'inherit' });

    // scripts 폴더가 없으면 생성
    if (!existsSync('scripts')) {
        mkdirSync('scripts', { recursive: true });
    }

    // main.js를 scripts 폴더로 복사
    if (existsSync('src/main.js')) {
        copyFileSync('src/main.js', 'scripts/main.js');
        console.log('✅ main.js copied to scripts folder');
    }

    console.log('✅ Build completed successfully!');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
