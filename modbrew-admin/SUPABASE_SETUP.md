# Supabase Setup Instructions

## Environment Variables

Create a `.env.local` file in the root of the modbrew-admin project with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Database Tables

Make sure you have created the following tables in your Supabase database:

### Expenses Table
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  purchased_at TIMESTAMP NOT NULL,
  item_name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  purchaser TEXT CHECK (purchaser IN ('mary', 'will', 'ben'))
);
```

### Daily Sales Table
```sql
CREATE TABLE daily_sales (
  id SERIAL PRIMARY KEY,
  sales_date DATE NOT NULL UNIQUE,
  customer_count INT NOT NULL,
  gross_sales NUMERIC(10,2) NOT NULL
);
```

## Features Added

1. **Add Daily Sales Modal**: Allows adding daily sales data with date, customer count, and gross sales amount
2. **Add Expense Modal**: Allows adding expenses with item name, price, date, and purchaser
3. **Supabase Integration**: Both modals now save data directly to the Supabase database
4. **Toast Notifications**: Success and error messages are displayed when adding data

## Usage

1. Set up your environment variables
2. Run `npm run dev` to start the development server
3. Use the Quick Actions buttons on the home page to add daily sales or expenses
4. Data will be saved to your Supabase database and you'll see confirmation messages
