import { auth } from "@root/auth"

async function testAuth() {
  console.log("✅ Auth config loads successfully")
  console.log("If this prints, your auth.ts is valid")
}

testAuth()