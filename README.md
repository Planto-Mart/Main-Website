<div style="display: flex; justify-content: space-between; align-items: center;">
  <h2>PlantoMart Main-Website</h2>
  <!-- <img alt="Status" src="https://img.shields.io/badge/status-production-brightgreen" /> -->
  <img alt="Status" src="https://img.shields.io/badge/status-under--development-orange" />
  <!-- <img alt="Status" src="https://img.shields.io/badge/status-production--in--progress-yellow" /> -->
  <!-- <img alt="Status" src="https://img.shields.io/badge/status-beta-blue" /> -->
</div>

<div style="display: flex; justify-content: space-between; flex-wrap: wrap; align-items: flex-start;">
  <div style="flex: 1; min-width: 250px;">
    <h3>Table of Contents</h3>
    <ul>
      <li><a href="#about">About</a></li>
      <li><a href="#key-features-of-plantomart">Key Features</a></li>
      <li><a href="#getting-started">Getting Started</a></li>
      <li><a href="#working-guidelines">Working Guidelines</a></li>
      <li><a href="#benefits-of-this-platform">Benefits</a></li>
      <li><a href="#use-cases">Use Cases</a></li>
    </ul>
  </div>

Planto-Mart is a robust, full-stack eCommerce platform built for multi-vendor operations. It allows multiple vendors to create and manage their own online stores within a unified marketplace. Customers can browse products from various vendors, make purchases across different shops, and have a seamless experience on a single platform.

The platform is built with scalability, security, and ease of use in mind, enabling a wide range of businesses to set up their online presence, sell products, and track performance.

<div style="flex: 1; min-width: 250px;">
    <h3>Built With</h3>
    <p>
      <img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" />
      <img alt="NextJS" src="https://img.shields.io/badge/-NextJS-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
      <img alt="pnpm" src="https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white" />
      <img alt="TailwindCSS" src="https://img.shields.io/badge/-Tailwind CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
      <img alt="Cloudflare" src="https://img.shields.io/badge/Cloudflare-F38020?style=flat&logo=Cloudflare&logoColor=white" />
      <img alt="git" src="https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white" />
      <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
      <img alt="Razorpay" src="https://img.shields.io/badge/Razorpay-02042B?style=flat-square&logo=razorpay&logoColor=white" />
      <img alt="Google OAuth" src="https://img.shields.io/badge/Google%20OAuth-via%20GCP-4285F4?style=flat-square&logo=google&logoColor=white" />
      <img alt="Supabase Auth" src="https://img.shields.io/badge/Supabase-Auth-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
    </p>

  </div>
</div>

## Built and Maintained by **[Adnan](https://Github.com/Adnan-The-Coder)**

<br>

## Key Features of PlantoMart:

1. Multi-Vendor Support
- Vendor Onboarding: Vendors can easily sign up and set up their stores. The registration process is straightforward, with a dedicated admin panel to manage all vendor activities.
- Product Management: Vendors have the ability to list and manage products, update inventory, set pricing, and categorize products within their store.
- Custom Storefronts: Each vendor gets a personalized storefront with the flexibility to customize their layout, branding, and product presentation.
- Order Management: Vendors can manage customer orders, update order status, and track shipments in real-time through their own dashboard.


2. Customer Experience
- Product Discovery: Customers can easily search and filter through a wide range of products, and view detailed information, reviews, and ratings from different vendors.
- Cross-Vendor Shopping Cart: Customers can add products from multiple vendors to a single cart and check out in one seamless transaction, with payment options supported across all vendors.
- Secure Transactions: Payments are securely processed, and the platform supports multiple payment gateways, ensuring that both vendors and customers are protected.
- Order Tracking: Once an order is placed, customers can track their shipments and receive updates until their items are delivered.


3. Vendor Dashboard
- Comprehensive Analytics: Vendors can track sales, customer behavior, and other key performance indicators (KPIs) via an easy-to-understand dashboard that offers real-time insights into their store’s performance.
- Inventory Management: Vendors can manage their inventory, receive alerts when stock levels are low, and restock products efficiently.
- Marketing Tools: Vendors have access to promotional tools like discount codes, flash sales, and the ability to feature products to attract more customers.
- Customer Communication: Vendors can interact with their customers through direct messaging, resolving issues, and providing support when needed.

4. Admin Panel
- Super Admin Controls: The platform includes an overarching admin panel where the platform administrators can monitor all vendor activity, approve product listings, handle disputes, and enforce platform rules.
- Transaction Management: Admins can track all platform-wide transactions, including vendor payouts and customer purchases.
- User & Role Management: The admin can assign and manage roles to different users, such as moderators, vendors, and customer service representatives, ensuring smooth operation.

5. Scalable Architecture
- Modular Design: Planto-Mart's architecture is modular, allowing for easy addition of new features and expansion as the platform grows. Whether you’re scaling to hundreds or thousands of vendors, the system can handle high traffic and large volumes of data.
- Microservices-based: The platform leverages a microservices-based architecture, making it easier to update, maintain, and scale each component independently without disrupting the entire system.
- Cloud-Optimized: Deployed on Cloudflare for performance optimization, security enhancements, and scalability, ensuring fast load times and high availability.

6. Security and Privacy
- Secure Authentication: Users and vendors are required to log in via secure authentication protocols, including multi-factor authentication (MFA), ensuring that only authorized users can access sensitive data.
- Data Encryption: All user and transaction data is encrypted, maintaining the privacy and security of sensitive information.
- PCI-DSS Compliance: The platform follows PCI-DSS standards for payment processing, ensuring all transactions are secure and compliant with industry regulations.
- Fraud Prevention: Built-in fraud detection systems monitor suspicious activity, protecting both vendors and customers from potential scams.

7. Mobile-Responsive Design
- The platform is fully mobile-responsive, offering an optimized experience for customers and vendors alike. Whether browsing products, placing orders, or managing store settings, users can seamlessly interact with the platform on any device.

8. Integrated Marketing and SEO Tools
- SEO Optimization: Vendors can optimize their products with detailed SEO fields to improve visibility on search engines.
- Promotions & Coupons: The platform allows vendors to create promotions, coupons, and discount codes, helping them boost sales and attract new customers.
- Product Reviews: Customers can leave feedback on products, helping vendors build trust and enabling shoppers to make informed decisions.



## Getting Started

First, run the development server:

```bash
bun run dev
```
If bun is not installed 
<br>
For Windows
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```
For Mac
```bash
npm install bun -g
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


# Working Guidelines

## 1. Branching Strategy
Start from dev branch: When starting any work, always create your branch from the dev branch.
Branch naming convention:
* For new features: feat/feature-name
* For bug fixes: fix/whatyouarefixing
* For updating content: update/whereyouareupdating
* For documentation updates: docs/whatyouupdated
* For refactoring code: refactor/whatyourefactored
* For urgent hotfixes: hotfix/urgentfix

## 2. Pull Request (PR) Workflow
### Step 1: Development
After completing your task, push your changes and create a PR to merge your branch into the dev branch.
Provide a clear description of the changes in the PR.
### Step 2: Testing
Test your code locally before creating a Pull Request merge with the main.
```
bun run deploy
```
# For Windows systems use wsl
```
wsl --install
wsl --install -d Ubuntu-22.04
sudo apt update
sudo apt full-upgrade -y
sudo apt install curl
sudo apt install unzip
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```
**Verify Installation**
```
bun --version
```
**Now test the deployment locally**
```
bun run deploy
```

### Step 3: Production
After successful testing, create a PR from the test branch to the main branch.
## 3. Commit Message Guidelines
Use the following prefixes for clear and consistent commit messages:

```
feat: for new features.
fix: for bug fixes.
docs: for documentation updates.
refactor: for code refactoring.
style: for formatting and style changes (not affecting code logic).
test: for adding or updating tests.
chore: for maintenance tasks.
```
```
Example: feat: add user authentication to login page.
```
## 4. CI/CD Pipeline Requirements
The CI/CD pipeline must run error-free.
Both ESLint checks and Next.js build must pass successfully for the PR to be valid.
## 5. Conflict Resolution
If any merge conflicts arise, contributors should immediately contact [Adnan](https://github.com/Adnan-The-Coder) for resolution.
## 6. PR Review Time
All PRs should be reviewed and resolved within 5 days of submission.

### Deployed on CloudFlare
The Planto-Mart platform is deployed on Cloudflare for improved security, performance, and scalability.


## Benefits of this Platform:
**For Vendors:**

- Increased Reach: Planto-Mart provides vendors with access to a broad customer base, eliminating the need to drive traffic to a standalone website.
- Analytics: Real-time performance tracking and actionable insights help vendors optimize their offerings.
- Cost-Effective: By utilizing a shared platform, vendors don’t have to build their own infrastructure from scratch, saving on development and hosting costs.
- Easy Management: A user-friendly dashboard simplifies the process of managing inventory, orders, and customer interactions.

**For Customers:**

- Convenience: Shoppers can explore a wide variety of products across different vendors in one place, with a unified cart and checkout process.
- Competitive Prices: Customers can compare prices from various vendors, helping them find the best deals.
- Trustworthy Reviews: The ability to read reviews from other customers adds a layer of trust and transparency to the shopping experience.

**For Platform Administrators:**

- Centralized Control: Admins can oversee all platform operations, monitor transactions, and enforce policies in one place.
- Revenue Generation: The platform offers various monetization strategies, including subscription fees, transaction fees, or featured product listings.
- User Management: Admins can easily manage users, resolve disputes, and ensure compliance with platform guidelines.

## Use Cases:
- Small-to-Medium Enterprises (SMEs) looking for an affordable way to manage their online stores.
- Large Marketplaces with multiple vendors who need centralized management tools for both the platform and vendors.
- Niche Vendors who want to sell their products to a broader audience but lack the infrastructure for an independent eCommerce site.
- Global Enterprises that need scalable, secure solutions for managing multiple vendors in various regions.