const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('file:///home/abhishek/Desktop/PORTFOLIOOS/index.html');
    
    // Type sudo admin
    await page.fill('#cli-input', 'sudo admin');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    // Type 2130 to login
    await page.fill('#adm-pass-input', '2130');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    // Check if logged in
    const shellVisible = await page.isVisible('#adm-shell');
    console.log('Logged in with 2130:', shellVisible);
    
    // Navigate to security
    await page.click('text=Security');
    await page.waitForTimeout(500);
    
    // Change password to 1234
    await page.fill('#sp-old', '2130');
    await page.fill('#sp-new', '12345');
    await page.fill('#sp-confirm', '12345');
    await page.click('button:has-text("Update Password")');
    await page.waitForTimeout(500);
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(500);
    
    // Type sudo admin
    await page.fill('#cli-input', 'sudo admin');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    // Try old password
    await page.fill('#adm-pass-input', '2130');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    let shellVisible2 = await page.isVisible('#adm-shell');
    console.log('Logged in with 2130 after change:', shellVisible2);
    
    if (shellVisible2) {
        // Logout
        await page.evaluate(() => admLogout());
        await page.waitForTimeout(500);
    }
    
    // Try new password
    await page.fill('#adm-pass-input', '12345');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    let shellVisible3 = await page.isVisible('#adm-shell');
    console.log('Logged in with 12345 after change:', shellVisible3);
    
    await browser.close();
})();
