import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

console.log('🔨 Psybox Physics Engine 빌드 시작...');

try {
    // TypeScript 컴파일
    console.log('📦 TypeScript 컴파일 중...');
    execSync('tsc', { stdio: 'inherit' });

    console.log('✅ 빌드 완료!');
    console.log('📁 컴파일된 파일은 scripts/ 폴더에 있습니다.');

} catch (error) {
    console.error('❌ 빌드 실패:', error.message);
    process.exit(1);
}
