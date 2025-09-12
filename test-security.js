#!/usr/bin/env node

/**
 * Security Headers Testing Script
 * Tests if security headers are properly configured
 */

const https = require('https');
const http = require('http');

const testUrl = process.argv[2] || 'http://localhost:8080';
const url = new URL(testUrl);

const requiredHeaders = {
  'strict-transport-security': 'HSTS header for HTTPS enforcement',
  'x-content-type-options': 'Prevents MIME type sniffing',
  'x-frame-options': 'Prevents clickjacking attacks',
  'x-xss-protection': 'XSS protection',
  'referrer-policy': 'Controls referrer information',
  'content-security-policy': 'Prevents XSS and injection attacks',
  'permissions-policy': 'Controls browser features'
};

const client = url.protocol === 'https:' ? https : http;

console.log(`🔍 Testing security headers for: ${testUrl}\n`);

const request = client.request(url, (response) => {
  console.log(`Status: ${response.statusCode} ${response.statusMessage}`);
  console.log(`Protocol: ${url.protocol.toUpperCase()}\n`);

  let score = 0;
  const totalHeaders = Object.keys(requiredHeaders).length;

  console.log('Security Headers Check:');
  console.log('='.repeat(50));

  Object.entries(requiredHeaders).forEach(([header, description]) => {
    const value = response.headers[header];
    const present = !!value;
    const icon = present ? '✅' : '❌';
    
    console.log(`${icon} ${header.toUpperCase()}`);
    console.log(`   ${description}`);
    
    if (present) {
      score++;
      console.log(`   Value: ${value.substring(0, 80)}${value.length > 80 ? '...' : ''}`);
    } else {
      console.log(`   Status: Missing`);
    }
    console.log('');
  });

  // Calculate security score
  const percentage = Math.round((score / totalHeaders) * 100);
  let grade = 'F';
  if (percentage >= 90) grade = 'A';
  else if (percentage >= 80) grade = 'B';
  else if (percentage >= 70) grade = 'C';
  else if (percentage >= 60) grade = 'D';

  console.log('Security Score:');
  console.log('='.repeat(50));
  console.log(`Score: ${score}/${totalHeaders} (${percentage}%)`);
  console.log(`Grade: ${grade}`);

  if (percentage < 100) {
    console.log('\n⚠️  Recommendations:');
    console.log('- Configure missing headers on your web server');
    console.log('- Use the provided nginx.conf.template or .htaccess file');
    console.log('- Test again after server configuration');
  } else {
    console.log('\n🛡️  Excellent! All security headers are properly configured.');
  }

  // HTTPS check
  if (url.protocol === 'http:' && url.hostname !== 'localhost') {
    console.log('\n🚨 Warning: Site is not using HTTPS in production!');
  }

}).on('error', (error) => {
  console.error(`❌ Error testing ${testUrl}:`, error.message);
  console.log('\nTip: Make sure the server is running and accessible.');
});

request.end();
