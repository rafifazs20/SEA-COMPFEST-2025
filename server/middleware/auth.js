function ensureAuthenticated(req, res, next){
  if(req.session && req.session.user) return next();
  return res.status(401).json({ message: "Login dulu ya"});
}

function ensureAdmin(req, res, next){
  if(req.session?.user?.isAdmin) return next();
  return res.status(403).json({ message: "Akses hanya admin"});
}

module.exports = {ensureAuthenticated, ensureAdmin};