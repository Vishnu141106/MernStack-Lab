@echo off
echo ====================================================
echo Starting Local MongoDB Server on Port 27017...
echo Database Storage: C:\Users\Vishnu Vardhan\mongodb\data\db
echo URI: mongodb://127.0.0.1:27017/smartstudy
echo ====================================================
"C:\Users\Vishnu Vardhan\mongodb\MongoDB\Server\9.0\bin\mongod.exe" --dbpath "C:\Users\Vishnu Vardhan\mongodb\data\db" --bind_ip 127.0.0.1 --port 27017
pause
