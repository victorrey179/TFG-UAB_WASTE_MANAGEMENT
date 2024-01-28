"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_ID = exports.client = void 0;
const google_auth_library_1 = require("google-auth-library");
const CLIENT_ID = '701411291905-ftr7oi993h6ce1e971nd88vrtin6c12k.apps.googleusercontent.com'; // Reemplaza con tu Client ID real
exports.CLIENT_ID = CLIENT_ID;
const CLIENT_SECRET = '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'; // Reemplaza con tu Client Secret real
const REDIRECT_URI = 'http://localhost:3000/oauth2callback'; // Reemplaza con tu Redirect URI real
const client = new google_auth_library_1.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
exports.client = client;
