// Shared per-section layout helpers used by CV templates to honor the
// "Colonne de gauche/droite" (column), "Renommer la rubrique" (title), and
// "Insérer un saut de page" (page break) options in the CV_Builder section
// menu. See client_side/app/CV_Builder/page.jsx (useSectionMenu) for how
// sectionColumn/sectionTitleOverrides/sectionPageBreak are produced.

export function makeSectionLayout(
  { sectionTitleOverrides = {}, sectionColumn = {}, sectionPageBreak = {} } = {},
  defaultColumnMap = {}
) {
  const getTitle = (id, defaultTitle) => sectionTitleOverrides?.[id] || defaultTitle;

  const getColumn = (id) =>
    sectionColumn?.[id] === 'left' || sectionColumn?.[id] === 'right'
      ? sectionColumn[id]
      : defaultColumnMap[id] || 'right';

  const pageBreakStyle = (id) => ({
    pageBreakBefore: sectionPageBreak?.[id] ? 'always' : 'auto',
    breakBefore: sectionPageBreak?.[id] ? 'page' : 'auto',
  });

  return { getTitle, getColumn, pageBreakStyle };
}
