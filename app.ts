import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import  express from 'express';
import dotenv from 'dotenv'
import { google, sheets_v4 } from 'googleapis';

const app =express();
app.use(express.json());
dotenv.config();
const PORT=process.env.PORT || 5000;

const spreadsheetId = process.env.GOOGLE_SHEET_ID ;


const auth=new google.auth.GoogleAuth({
  keyFile:"credentials.json",
  scopes:"https://www.googleapis.com/auth/spreadsheets"
});


const range = 'Sheet1!A:B';
const sheetName='Sheet1';
const numRowsToSkip=3;


const values = [
  ['Aman','34'],
  ['Sumit', '42'],
];


app.get('/',async (req,res)=>{
      //create client instance for auth
      const client=await auth.getClient();
      const googleSheets = google.sheets({ version: "v4", auth: client });

  
      //get meta data from google sheet
      const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
      });

      // Read rows from spreadsheet
      const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: range,
      });

      // Write rows to googlesheet

      await  googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: range,
        valueInputOption: "USER_ENTERED",
        insertDataOption: 'INSERT_ROWS',
        requestBody:{values},
      });

     res.send(getRows.data);

});


app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})