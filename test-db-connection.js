require("dotenv").config();
const db = require("./models");

async function testConnection() {
  try {
    console.log("🔄 Testing Neon DB connection...\n");

    // Test Sequelize connection
    await db.sequelize.authenticate();
    console.log("✅ Successfully connected to Neon DB!");
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   User: ${process.env.DB_USER}`);

    // Test sync models
    await db.sequelize.sync({ alter: false });
    console.log("\n✅ All models synchronized successfully!");

    // Check models
    console.log("\n📋 Available models:");
    const models = ["user", "request", "equipment", "notification", "intervention"];
    models.forEach((model) => {
      if (db[model]) {
        console.log(`   ✓ ${model}`);
      }
    });

    console.log("\n✅ Database connection test PASSED!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection test FAILED!");
    console.error("\nError Details:");
    console.error(error.message);
    console.error("\n📝 Checklist:");
    console.error("   - Verify .env file exists in root directory");
    console.error("   - Check DB credentials in .env file");
    console.error("   - Ensure internet connection is stable");
    console.error("   - Verify Neon DB is not blocked by firewall");
    process.exit(1);
  }
}

testConnection();
