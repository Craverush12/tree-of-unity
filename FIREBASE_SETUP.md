# Firebase Setup Guide for Tree of Unity

## 1. Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project details:
   - **Project name**: `tree-of-unity`
   - **Google Analytics**: Enable (optional)
4. Click "Create project"
5. Wait for the project to be set up

## 2. Enable Realtime Database

1. In your Firebase project dashboard, go to **Build** → **Realtime Database**
2. Click "Create Database"
3. Choose **Start in test mode** (for development)
4. Select a location closest to your users
5. Click "Done"

## 3. Get Project Configuration

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll down to "Your apps" section
3. Click "Web app" icon (`</>`)
4. Enter app nickname: `tree-of-unity-web`
5. **Don't** check "Also set up Firebase Hosting"
6. Click "Register app"
7. Copy the Firebase configuration object

## 4. Update Environment Variables

1. Open `.env.local` file in your project root
2. Replace the placeholder values with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 5. Set Up Database Rules

1. Go to **Realtime Database** → **Rules**
2. Replace the default rules with:

```json
{
  "rules": {
    "leaves": {
      ".read": true,
      ".write": true,
      ".indexOn": ["x", "y", "created_at"]
    }
  }
}
```

3. Click "Publish"

## 6. Test the Setup

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/tree` page
3. Try adding a leaf - it should save to Firebase
4. Open the tree page in another browser tab
5. Add a leaf from the form page - it should appear on the tree page in real-time

## 7. Database Structure

Your Firebase Realtime Database will have this structure:
```
leaves/
  ├── leaf_id_1/
  │   ├── name: "John"
  │   ├── city: "Riyadh"
  │   ├── x: 600
  │   ├── y: 250
  │   ├── angle: 45
  │   ├── scale: 0.8
  │   ├── leaf_type: "leaf1"
  │   └── created_at: "2024-01-01T12:00:00.000Z"
  └── leaf_id_2/
      └── ...
```

## 8. Advantages of Firebase

✅ **Global Real-time**: Works in all regions
✅ **No SQL Required**: Simple JSON structure
✅ **Automatic Scaling**: Handles any number of users
✅ **Free Tier**: 1GB storage, 10GB transfer/month
✅ **Real-time Sync**: Instant updates across all users
✅ **Conflict Resolution**: Built-in handling of simultaneous writes

## 9. Troubleshooting

### Common Issues:

1. **"Firebase not initialized"**: Check your environment variables
2. **"Permission denied"**: Check your database rules
3. **Real-time not working**: Verify database rules allow read/write
4. **CORS errors**: Firebase handles this automatically

### Debug Steps:

1. Check browser console for Firebase errors
2. Verify environment variables are loaded
3. Test database connection in Firebase console
4. Check database rules in Firebase console

## 10. Production Deployment

For production:

1. Update environment variables in your hosting platform
2. Set up proper database rules for security
3. Consider upgrading to Firebase Blaze plan for production
4. Monitor usage in Firebase console

## 11. Security Rules (Production)

For production, use these more secure rules:

```json
{
  "rules": {
    "leaves": {
      ".read": true,
      ".write": "auth != null",
      ".indexOn": ["x", "y", "created_at"]
    }
  }
}
```

## Support

If you encounter issues:
1. Check the Firebase documentation
2. Review the browser console for errors
3. Test the database connection in Firebase console
4. Verify all environment variables are correctly set

## Migration from Supabase

The Firebase implementation uses the same API as the Supabase version, so no code changes are needed beyond the import statement. The functionality remains identical!
