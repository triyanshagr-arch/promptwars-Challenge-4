import fs from 'fs';
import path from 'path';

export interface Incident {
  id: string;
  timestamp: string;
  location: string;
  description: string;
  status: 'new' | 'investigating' | 'resolved';
  aiActionPlan?: string;
  source: 'fan_app' | 'staff';
}

const dataFile = path.join(process.cwd(), 'data', 'incidents.json');

export function getIncidents(): Incident[] {
  try {
    if (!fs.existsSync(dataFile)) {
      return [];
    }
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading incidents:', error);
    return [];
  }
}

export function saveIncident(incident: Incident) {
  const incidents = getIncidents();
  // prepend new incidents
  incidents.unshift(incident);
  try {
    if (!fs.existsSync(path.dirname(dataFile))) {
      fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    }
    fs.writeFileSync(dataFile, JSON.stringify(incidents, null, 2));
  } catch (error) {
    console.error('Error saving incident:', error);
  }
  return incident;
}

export function updateIncidentStatus(id: string, status: Incident['status']) {
  const incidents = getIncidents();
  const index = incidents.findIndex(i => i.id === id);
  if (index !== -1) {
    incidents[index].status = status;
    fs.writeFileSync(dataFile, JSON.stringify(incidents, null, 2));
    return incidents[index];
  }
  return null;
}
