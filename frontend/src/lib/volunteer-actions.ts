"use server";

import { getVolunteers, VOLUNTEERS_PAGE_SIZE, type VolunteerPage } from "@/lib/volunteers";

// "Show more" on /volunteer: the next page of approved volunteers, already
// reduced to the public fields by getVolunteers().
export async function loadMoreVolunteers(page: number): Promise<VolunteerPage> {
  if (!Number.isInteger(page) || page < 2 || page > 1000) return { volunteers: [], total: 0, hasNext: false };
  return getVolunteers(page, VOLUNTEERS_PAGE_SIZE);
}
