// console.log("TODO: Implement me!");

import axios from "axios";

const BASE_URL = 'https://localhost:3000';


type ShiftDTO = {
    id: number;
    workplaceId: number;
    completedAt: string | null;
  };

type WorkplaceDTO = {
  id: number;
  name: string;
};

async function fetchShifts(): Promise<ShiftDTO[]> {
    const response = await axios.get(`${BASE_URL}/shifts`);
    return response.data;
}

async function fetchWorkplace(id:number): Promise<WorkplaceDTO> {
    const response = await axios.get(`${BASE_URL}/workplaces/${id}`);
    return response.data;
}

async function main() {
    try {
      const shifts = await fetchShifts();
  
      // Count only completed shifts per workplace
      const shiftCounts: Record<number, number> = {};
  
      for (const shift of shifts) {
        if (shift.completedAt) {
          shiftCounts[shift.workplaceId] = (shiftCounts[shift.workplaceId] || 0) + 1;
        }
      }
  
      // Sort workplace IDs by shift count descending
      const topWorkplaceIds = Object.entries(shiftCounts)
        .sort(([, a], [, b]) => b - a)
        // top 3
        .slice(0, 3);
  
      const result: { name: string; shifts: number }[] = [];
  
      for (const [idStr, count] of topWorkplaceIds) {
        const id = Number(idStr);
        try {
          const workplace = await fetchWorkplace(id);
          result.push({ name: workplace.name, shifts: count });
        } catch (error) {
          console.warn(`Skipping workplace ${id}: failed to fetch`);
        }
      }
  
      // Print result in JSON format
      console.log(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error('Error running top workplaces script:', err);
    }
  }
  
  main();
