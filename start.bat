@echo off
chcp 65001 >nul

setlocal enabledelayedexpansion

title 星火智岗 - 启动脚本

:: 颜色输出
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "CYAN=[96m"
set "RESET=[0m"

echo.
echo %CYAN%╔══════════════════════════════════════════════╗%RESET%
echo %CYAN%║       星火智岗 - Spark Jobs Frontend         ║%RESET%
echo %CYAN%╚══════════════════════════════════════════════╝%RESET%
echo.

:: 检查 Node.js 是否安装
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %RED%[错误] 未检测到 Node.js，请先安装 Node.js (推荐 v18+)^
    echo        下载地址：https://nodejs.org/%RESET%
    pause
    exit /b 1
)
echo %GREEN%[✓] Node.js    %RESET% node %RESET%

:: 检查 npm 是否安装
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %RED%[错误] 未检测到 npm%RESET%
    pause
    exit /b 1
)
echo %GREEN%[✓] npm        %RESET% npm %RESET%

:: 自动安装依赖
if not exist "node_modules" (
    echo.
    echo %YELLOW%[..] 正在安装依赖，请稍候...%RESET%
    echo.
    call npm install
    if !ERRORLEVEL! neq 0 (
        echo.
        echo %RED%[错误] 依赖安装失败，请检查网络连接后重试%RESET%
        pause
        exit /b 1
    )
    echo.
    echo %GREEN%[✓] 依赖安装完成%RESET%
) else (
    echo %GREEN%[✓] 依赖已安装%RESET%
)

:: 检查是否有 package-lock.json，若没有则执行 npm install 以确保依赖完整
if not exist "package-lock.json" (
    echo.
    echo %YELLOW%[..] 未检测到 lock 文件，执行 npm install...%RESET%
    call npm install
)

echo.
echo %CYAN%───────────────────────────────────────────────%RESET%
echo  %GREEN%启动开发服务器...%RESET%
echo.
echo   %YELLOW%本地地址：%RESET%  http://localhost:5173
echo   %YELLOW%退出：%RESET%     在窗口中按 Ctrl+C
echo.
echo %CYAN%───────────────────────────────────────────────%RESET%
echo.

:: 自动打开浏览器
start http://localhost:5173

:: 启动 Vite 开发服务器
call npm run dev

:: 如果用户关闭了服务器
echo.
echo %YELLOW%开发服务器已关闭%RESET%
echo.
pause
