const https = require('https');

const slugs = ['java', 'oracle', 'openjdk', 'csharp', 'css3', 'framer', 'framermotion', 'amazonaws', 'aws'];

slugs.forEach(slug => {
  https.get(`https://cdn.simpleicons.org/${slug}`, (res) => {
    console.log(`${slug}: ${res.statusCode}`);
  });
});
