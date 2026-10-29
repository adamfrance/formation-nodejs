// Transforme un titre en identifiant utilisable dans une URL
function slugify(text) {
  return text.trim().toLowerCase().replace(/\s+/g, '-');
}

module.exports = { slugify };
