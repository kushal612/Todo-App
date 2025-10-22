export function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export function getImportanceBadge(isImportant) {
  return `<span class="badge bg-${isImportant ? 'danger' : 'secondary'}">${
    isImportant ? 'Important' : 'Normal'
  }</span>`;
}

export function renderTags(tags) {
  if (!tags.length) {
    return '';
  }
  return tags
    .map((tag) => `<span class="badge bg-info text-dark me-1">#${tag}</span>`)
    .join('');
}
