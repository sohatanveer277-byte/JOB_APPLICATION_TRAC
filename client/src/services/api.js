const BASE_URL = '/api';

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchApplications({ status, search, sort } = {}) {
  const params = new URLSearchParams();
  if (status && status !== 'All') params.append('status', status);
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);

  const res = await fetch(`${BASE_URL}/applications?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch applications');
  return res.json();
}

export async function createApplication(data) {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create application');
  }
  return res.json();
}

export async function updateApplication(id, data) {
  const res = await fetch(`${BASE_URL}/applications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update application');
  }
  return res.json();
}

export async function updateApplicationStatus(id, status) {
  const res = await fetch(`${BASE_URL}/applications/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update status');
  }
  return res.json();
}

export async function deleteApplication(id) {
  const res = await fetch(`${BASE_URL}/applications/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete application');
  return res.json();
}
