@echo off
echo Building Oullim Spirra Physics Engine...
npm run build
if %errorlevel% equ 0 (
    echo Build successful!
    echo Copying to Minecraft development folder...
    xcopy /E /Y . "%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\Oullim_Spirra_Physics_BP\"
    echo Installation complete!
) else (
    echo Build failed!
)
pause