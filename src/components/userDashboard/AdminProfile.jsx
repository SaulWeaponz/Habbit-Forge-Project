import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Avatar, IconButton, Alert, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { API_ENDPOINTS } from '../../config/strapi';

// ... existing code ...

        fetch(API_ENDPOINTS.USERS + '?populate=profilePicture')

// ... existing code ...

            : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${matched.profilePicture[0].url}`;

// ... existing code ...

            : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${matched.profilePicture.url}`;

// ... existing code ...

        const response = await fetch(API_ENDPOINTS.UPLOAD, {

// ... existing code ...

            ? (data[0].url.startsWith('http') ? data[0].url : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${data[0].url}`)

// ... existing code ...

        const response = await fetch(`${API_ENDPOINTS.USERS}/${adminInfo.id}`, {

// ... existing code ...

            : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${adminInfo.profilePicture[0].url}`;

// ... existing code ...

            : `${API_ENDPOINTS.USERS.replace('/api/users', '')}${adminInfo.profilePicture.url}`;

// ... existing code ...
