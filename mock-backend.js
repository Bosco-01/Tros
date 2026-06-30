const http = require('http');

const PORT = 8080;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);

  // 1. Simulate GET /admin/profile
  if (req.method === 'GET' && parsedUrl.pathname === '/admin/profile') {
    res.writeHead(200);
    res.end(JSON.stringify({
      id: '001294',
      name: 'Active DB Admin', // Custom name to prove it came from this server
      email: 'active_db@trios.com',
      role: 'SUPER_ADMIN',
      is_active: true,
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop'
    }));
  } 
  // 2. Simulate GET /admin/dashboard
  else if (req.method === 'GET' && parsedUrl.pathname === '/admin/dashboard') {
    res.writeHead(200);
    res.end(JSON.stringify({
      total_events: 999, // Custom distinctive values
      total_users: 5555,
      total_vendors: 444,
      total_subscriptions: 333,
      total_bookings: 888,
      total_revenue: 2500000,
      events_trend_pct: 12,
      users_trend_pct: 18,
      vendors_trend_pct: -4,
      subscriptions_trend_pct: 9,
      pending_approvals: 3,
      pending_verifications: 2,
      recent_events: [],
      recent_vendors: []
    }));
  } 
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Route not found on mock backend' }));
  }
});

server.listen(PORT, () => {
  console.log(`Mock Database active at http://localhost:${PORT}`);
});