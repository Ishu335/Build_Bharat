# Quick Start Guide
## MGNREGA District Performance Portal

Get the MGNREGA portal up and running in 5 minutes!

---

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed ([Get Docker Compose](https://docs.docker.com/compose/install/))
- 4GB free RAM
- 5GB free disk space

### Steps

1. **Clone or download this project**
```bash
cd "Govt Task"
```

2. **Run the setup script**
```bash
chmod +x setup.sh
./setup.sh
```

3. **Access the application**
   - **Frontend**: http://localhost
   - **Backend API**: http://localhost:8000
   - **API Docs**: http://localhost:8000/docs

That's it! 🎉

---

## 🖥️ Manual Setup (Without Docker)

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create environment file
cp .env.example .env

# 6. Run the backend
uvicorn main:app --reload --port 8000
```

Backend will be running at http://localhost:8000

### Frontend Setup

Open a new terminal:

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

Frontend will be running at http://localhost:3000

---

## 📱 First Steps After Setup

### 1. Explore the Homepage
- See state-wide statistics
- Browse districts
- Understand MGNREGA metrics

### 2. Select a District
- Click on any district card
- Or use the district selector dropdown
- View detailed performance data

### 3. View Trends
- Scroll down to see charts
- Track performance over time
- Understand historical data

### 4. Compare Districts
- Go to "Compare" in navigation
- Select 2-4 districts
- See side-by-side comparison

---

## 🔧 Common Commands

### Docker Commands

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Restart containers
docker-compose restart

# Rebuild after code changes
docker-compose up -d --build

# View container status
docker-compose ps

# Clean up everything (including data)
docker-compose down -v
```

### Development Commands

```bash
# Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Frontend
cd frontend
npm run dev
npm run build  # Production build
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Error**: "Port 80 is already allocated" or "Port 8000 is already allocated"

**Solution**:
```bash
# Find and kill the process using the port
# On Linux/Mac:
sudo lsof -i :80
sudo kill -9 <PID>

# On Windows:
netstat -ano | findstr :80
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml
ports:
  - "8080:80"  # Use port 8080 instead of 80
```

### Docker Build Fails

**Solution**:
```bash
# Clean up Docker cache
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

### Backend Not Responding

**Solution**:
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Check if port 8000 is accessible
curl http://localhost:8000/
```

### Frontend Shows "Cannot connect to API"

**Solution**:
```bash
# Verify backend is running
curl http://localhost:8000/api/districts

# Check CORS settings in backend/.env
CORS_ORIGINS=http://localhost:3000,http://localhost

# Restart both services
docker-compose restart
```

### Database Errors

**Solution**:
```bash
# Reset database
docker-compose down -v
docker-compose up -d

# Or backup and recreate
docker exec mgnrega-backend sqlite3 /app/data/mgnrega.db ".backup '/app/data/backup.db'"
docker-compose down -v
docker-compose up -d
```

---

## 📊 Sample Data

The application includes mock data for Uttar Pradesh districts. On first run:
- 75 districts are initialized
- Sample data is generated for demonstration
- Initial sync happens for select districts (Lucknow, Varanasi, Agra)

To sync more districts:
1. Visit a district page
2. Click "Refresh" button
3. Or use the API: `POST http://localhost:8000/api/sync/{district_code}`

---

## 🌐 Access from Other Devices

### On Local Network

1. Find your computer's IP address:
```bash
# Linux/Mac
ifconfig | grep "inet "
# Windows
ipconfig
```

2. Update backend CORS settings:
```bash
# backend/.env
CORS_ORIGINS=http://localhost,http://192.168.x.x
```

3. Access from mobile/tablet:
```
http://192.168.x.x
```

---

## 🔐 Security Notes

⚠️ **For Development Only**

The default setup is configured for development. For production:

1. **Change default secrets**
2. **Enable HTTPS**
3. **Configure firewall**
4. **Use PostgreSQL instead of SQLite**
5. **Set up monitoring**
6. **Enable authentication** (if needed)

See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup.

---

## 📖 Next Steps

1. **Read the full README**: [README.md](README.md)
2. **Deploy to production**: [DEPLOYMENT.md](DEPLOYMENT.md)
3. **Understand architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
4. **Customize the app**: Modify colors, fonts, content
5. **Add more states**: Extend beyond Uttar Pradesh

---

## 💡 Tips

### Performance Tips
- Use Chrome/Firefox for best performance
- Clear browser cache if experiencing issues
- Enable hardware acceleration in browser

### Development Tips
- Use React DevTools for debugging
- Check browser console for errors
- Use API docs at /docs for testing endpoints

### Mobile Testing
- Use Chrome DevTools mobile emulation
- Test on actual devices when possible
- Check touch targets are large enough (44px minimum)

---

## 🆘 Need Help?

1. **Check logs**: `docker-compose logs -f`
2. **Read documentation**: README.md, DEPLOYMENT.md, ARCHITECTURE.md
3. **Check API docs**: http://localhost:8000/docs
4. **Search issues**: Check GitHub issues
5. **Create new issue**: Include logs and error messages

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Frontend loads at http://localhost
- [ ] Backend responds at http://localhost:8000
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Can see list of districts
- [ ] Can select a district and view details
- [ ] Charts are rendering correctly
- [ ] Can compare multiple districts
- [ ] About page loads correctly
- [ ] Mobile responsive design works
- [ ] No console errors

---

**Happy coding! 🚀**

If you find this helpful, please star the repository!

