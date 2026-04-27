export function groupDownloadsByDate(items = []) {
  return items.reduce((groups, item) => {
    const rawDate = item.downloadedAt || item.createdAt;

    if (!rawDate) return groups;

    const dateLabel = new Date(rawDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }

    groups[dateLabel].push(item);

    return groups;
  }, {});
}