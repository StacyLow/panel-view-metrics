# Installed Panels Dashboard

A real-time dashboard for tracking installed solar panels with automated data synchronization.

## Features

- **Real-time Dashboard**: Monitor total panels, track progress, and view growth metrics
- **Historical Charts**: Visualize panel installation trends over time
- **Automated Data Sync**: Python script runs every 4 hours to fetch new panel data
- **Dockerized Deployment**: Complete containerized solution with nginx and automated processes

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Supabase service role key

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your Supabase credentials
# SUPABASE_PANEL_URL=https://your-project.supabase.co
# SUPABASE_API_KEY=your_service_role_key
```

### 2. Deploy with Docker Compose
```bash
# Build and start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

The dashboard will be available at `http://localhost:3000`

### 3. Production Deployment
```bash
# Build for production
docker-compose -f docker-compose.yml up -d

# Check health status
curl http://localhost:3000/health
```

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database + API)
- **Data Sync**: Python script with cron scheduling
- **Web Server**: nginx
- **Process Management**: supervisord
- **Containerization**: Docker with multi-stage builds

## Development

### Local Development (without Docker)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run Python script manually
cd scripts
python panel_upload.py
```

### Manual Data Sync
The Python script runs automatically every 4 hours, but you can trigger it manually:
```bash
# Inside the Docker container
docker-compose exec dashboard python /app/scripts/panel_upload.py

# Or run locally
python scripts/panel_upload.py
```

## Configuration

### Environment Variables
- `SUPABASE_PANEL_URL`: Your Supabase project URL
- `SUPABASE_API_KEY`: Supabase service role key (for server-side operations)

### Supabase Setup
The application expects a `panels` table with the following structure:
```sql
CREATE TABLE panels (
  id smallint PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  panel_serial text
);
```

## Monitoring

### Health Checks
- Application health: `GET /health`
- Docker health checks included in compose file

### Logs
- All application logs: `docker-compose logs dashboard`
- Follow logs in real-time: `docker-compose logs -f dashboard`
- Python script logs only: `docker-compose logs dashboard | grep panel_upload`

## Troubleshooting

### Common Issues
1. **Missing environment variables**: Ensure `.env` file is properly configured
2. **Database connection issues**: Verify Supabase credentials and network access
3. **Python script failures**: Check logs with `docker-compose logs dashboard | grep panel_upload`

### Debug Commands
```bash
# Check container status
docker-compose ps

# View all logs
docker-compose logs

# Execute commands in container
docker-compose exec dashboard bash

# Restart services
docker-compose restart
```

## Lovable Development

This project was created with [Lovable](https://lovable.dev/projects/8ba8a021-c722-4dc6-9eeb-9d179780e594).

You can edit this project in several ways:

**Use Lovable**: Visit the [Lovable Project](https://lovable.dev/projects/8ba8a021-c722-4dc6-9eeb-9d179780e594) and start prompting.

**Use your preferred IDE**: Clone this repo and push changes. Pushed changes will also be reflected in Lovable.

**Deploy**: Open [Lovable](https://lovable.dev/projects/8ba8a021-c722-4dc6-9eeb-9d179780e594) and click on Share → Publish.

## License

MIT License
