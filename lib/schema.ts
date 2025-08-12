import { relations, sql } from 'drizzle-orm';
import {
  mysqlTable,
  varchar,
  datetime,
  text,
  primaryKey,
  boolean,
  int,
  decimal,
  json,
} from 'drizzle-orm/mysql-core';

// ✅ User table (customers)
export const user = mysqlTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: datetime('emailVerified'),
  image: text('image'),
  profilePicture: varchar("profile_picture", { length: 255 }),
  username: varchar("username", { length: 100 }),
  displayName: varchar("display_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  address: varchar("address", { length: 255 }),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  newsletter: boolean("newsletter").default(false),
  dateOfBirth: datetime("date_of_birth"),
  otp: varchar("otp", { length: 6 }),
  otpExpiry: datetime("otp_expiry"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ✅ Accounts table (OAuth support: Google, Facebook)
export const account = mysqlTable(
  'account',
  {
    userId: varchar('userId', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: datetime('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: varchar('session_state', { length: 255 }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
  })
);

// ✅ Sessions table
export const sessions = mysqlTable('sessions', {
  sessionToken: varchar('sessionToken', { length: 255 }).primaryKey(),
  userId: varchar('userId', { length: 255 }).notNull(),
  expires: datetime('expires').notNull(),
});

// ✅ Verification tokens
export const verification_tokens = mysqlTable(
  'verification_tokens',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    otp: varchar('otp', { length: 255 }).notNull(),
    expires: datetime('expires').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.identifier, table.token, table.otp] }),
  })
);

// Product Categories
export const categories = mysqlTable("categories", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  bannerImage: varchar("banner_image", { length: 500 }), // Category banner image
  icon: varchar("icon", { length: 500 }), // For uploaded category icon files
  iconName: varchar("icon_name", { length: 100 }), // For category icons (e.g., FontAwesome icon names)
  isFeatured: boolean("is_featured").default(false), // For featured categories
  parentId: varchar("parent_id", { length: 255 }), // For hierarchical categories
  sortOrder: int("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Product Subcategories
export const subcategories = mysqlTable("subcategories", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  categoryId: varchar("category_id", { length: 255 }).notNull(),
  sortOrder: int("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Products
export const products = mysqlTable("products", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  sku: varchar("sku", { length: 100 }).unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  comparePrice: decimal("compare_price", { precision: 10, scale: 2 }),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  images: json("images"), // Array of image URLs
  banner: varchar("banner", { length: 500 }), // Banner image URL
  categoryId: varchar("category_id", { length: 255 }),
  subcategoryId: varchar("subcategory_id", { length: 255 }),
  tags: json("tags"), // Array of tags
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: json("dimensions"), // {length, width, height}
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  isDigital: boolean("is_digital").default(false),
  requiresShipping: boolean("requires_shipping").default(true),
  taxable: boolean("taxable").default(true),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  
  // Variable Product Fields
  productType: varchar("product_type", { length: 50 }).default("simple"), // 'simple' or 'variable'
  variationAttributes: json("variation_attributes"), // Array of {name: string, values: string[]}
  
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Product Variants (Size, Color, etc.)
export const productVariants = mysqlTable("product_variants", {
  id: varchar("id", { length: 255 }).primaryKey(),
  productId: varchar("product_id", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }).unique(),
  title: varchar("title", { length: 255 }).notNull(), // e.g., "Red / Large"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  comparePrice: decimal("compare_price", { precision: 10, scale: 2 }),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  image: varchar("image", { length: 500 }),
  position: int("position").default(0),
  inventoryQuantity: int("inventory_quantity").default(0),
  inventoryManagement: boolean("inventory_management").default(true),
  allowBackorder: boolean("allow_backorder").default(false),
  variantOptions: json("variant_options"), // {color: "Red", size: "Large"}
  isActive: boolean("is_active").default(true),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Variation Attributes (Color, Size, Material, etc.)
export const variationAttributes = mysqlTable("variation_attributes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(), // Color, Size, Material
  slug: varchar("slug", { length: 255 }).notNull().unique(), // color, size, material
  description: text("description"),
  type: varchar("type", { length: 50 }).default("select"), // select, color, image, button
  isActive: boolean("is_active").default(true),
  sortOrder: int("sort_order").default(0),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Variation Attribute Values (Red, Blue, Green for Color; S, M, L for Size)
export const variationAttributeValues = mysqlTable("variation_attribute_values", {
  id: varchar("id", { length: 255 }).primaryKey(),
  attributeId: varchar("attribute_id", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(), // Red, Blue, Small, Large
  slug: varchar("slug", { length: 255 }).notNull(), // red, blue, small, large
  colorCode: varchar("color_code", { length: 7 }), // #FF0000 for color attributes
  image: varchar("image", { length: 500 }), // Optional image for the value
  description: text("description"),
  isActive: boolean("is_active").default(true),
  sortOrder: int("sort_order").default(0),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Addon Groups (for organizing addons)
export const addonGroups = mysqlTable("addon_groups", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: int("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Addons (for group products)
export const addons = mysqlTable("addons", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  groupId: varchar("group_id", { length: 255 }), // Reference to addon_groups
  isActive: boolean("is_active").default(true),
  sortOrder: int("sort_order").default(0),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Product Addons (junction table for group products)
export const productAddons = mysqlTable("product_addons", {
  id: varchar("id", { length: 255 }).primaryKey(),
  productId: varchar("product_id", { length: 255 }).notNull(),
  addonId: varchar("addon_id", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Override price for this product
  isRequired: boolean("is_required").default(false),
  sortOrder: int("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Product Inventory
export const productInventory = mysqlTable("product_inventory", {
  id: varchar("id", { length: 255 }).primaryKey(),
  productId: varchar("product_id", { length: 255 }),
  variantId: varchar("variant_id", { length: 255 }),
  quantity: int("quantity").notNull().default(0),
  reservedQuantity: int("reserved_quantity").default(0),
  availableQuantity: int("available_quantity").default(0),
  reorderPoint: int("reorder_point").default(0),
  reorderQuantity: int("reorder_quantity").default(0),
  location: varchar("location", { length: 255 }),
  supplier: varchar("supplier", { length: 255 }),
  lastRestockDate: datetime("last_restock_date"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Stock Movements (Audit trail for all inventory changes)
export const stockMovements = mysqlTable("stock_movements", {
  id: varchar("id", { length: 255 }).primaryKey(),
  inventoryId: varchar("inventory_id", { length: 255 }).notNull(),
  productId: varchar("product_id", { length: 255 }).notNull(),
  variantId: varchar("variant_id", { length: 255 }),
  movementType: varchar("movement_type", { length: 50 }).notNull(), // 'in', 'out', 'adjustment'
  quantity: int("quantity").notNull(),
  previousQuantity: int("previous_quantity").notNull().default(0),
  newQuantity: int("new_quantity").notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  reference: varchar("reference", { length: 255 }), // PO number, invoice, etc.
  notes: text("notes"),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  supplier: varchar("supplier", { length: 255 }),
  processedBy: varchar("processed_by", { length: 255 }), // Admin user who made the change
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Orders
export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 255 }).primaryKey(),
  orderNumber: varchar("order_number", { length: 100 }).notNull().unique(),
  userId: varchar("user_id", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"), // pending, paid, failed, refunded
  fulfillmentStatus: varchar("fulfillment_status", { length: 50 }).default("pending"), // pending, fulfilled, partially_fulfilled
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxAmount: varchar("tax_amount", { length: 255 }).default('0.00,0.00'), // Format: "vatAmount,serviceAmount"
  shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }).default('0.00'),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default('0.00'),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  
  // Billing Address
  billingFirstName: varchar("billing_first_name", { length: 100 }),
  billingLastName: varchar("billing_last_name", { length: 100 }),
  billingAddress1: varchar("billing_address1", { length: 255 }),
  billingAddress2: varchar("billing_address2", { length: 255 }),
  billingCity: varchar("billing_city", { length: 100 }),
  billingState: varchar("billing_state", { length: 100 }),
  billingPostalCode: varchar("billing_postal_code", { length: 20 }),
  billingCountry: varchar("billing_country", { length: 100 }),
  
  // Shipping Address
  shippingFirstName: varchar("shipping_first_name", { length: 100 }),
  shippingLastName: varchar("shipping_last_name", { length: 100 }),
  shippingAddress1: varchar("shipping_address1", { length: 255 }),
  shippingAddress2: varchar("shipping_address2", { length: 255 }),
  shippingCity: varchar("shipping_city", { length: 100 }),
  shippingState: varchar("shipping_state", { length: 100 }),
  shippingPostalCode: varchar("shipping_postal_code", { length: 20 }),
  shippingCountry: varchar("shipping_country", { length: 100 }),
  
  shippingMethod: varchar("shipping_method", { length: 100 }),
  trackingNumber: varchar("tracking_number", { length: 255 }),
  notes: text("notes"),
  cancelReason: text("cancel_reason"),
  
  // Service scheduling fields
  serviceDate: varchar("service_date", { length: 10 }), // YYYY-MM-DD format
  serviceTime: varchar("service_time", { length: 8 }), // HH:MM format
  
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Order Items
export const orderItems = mysqlTable("order_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  orderId: varchar("order_id", { length: 255 }).notNull(),
  productId: varchar("product_id", { length: 255 }).notNull(),
  variantId: varchar("variant_id", { length: 255 }),
  productName: varchar("product_name", { length: 255 }).notNull(),
  variantTitle: varchar("variant_title", { length: 255 }),
  variationPrice: decimal("variation_price", { precision: 10, scale: 2 }),
  sku: varchar("sku", { length: 100 }),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  productImage: varchar("product_image", { length: 500 }),
  addons: json("addons"), // Store selected addons as JSON
  groupTitle: varchar("group_title", { length: 255 }), // Add group title for addon groups
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Returns
export const returns = mysqlTable("returns", {
  id: varchar("id", { length: 255 }).primaryKey(),
  returnNumber: varchar("return_number", { length: 100 }).notNull().unique(),
  orderId: varchar("order_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected, completed
  reason: varchar("reason", { length: 255 }).notNull(),
  description: text("description"),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  restockFee: decimal("restock_fee", { precision: 10, scale: 2 }).default('0.00'),
  adminNotes: text("admin_notes"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Return Items
export const returnItems = mysqlTable("return_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  returnId: varchar("return_id", { length: 255 }).notNull(),
  orderItemId: varchar("order_item_id", { length: 255 }).notNull(),
  productId: varchar("product_id", { length: 255 }).notNull(),
  variantId: varchar("variant_id", { length: 255 }),
  quantity: int("quantity").notNull(),
  condition: varchar("condition", { length: 50 }), // new, used, damaged
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Refunds
export const refunds = mysqlTable("refunds", {
  id: varchar("id", { length: 255 }).primaryKey(),
  orderId: varchar("order_id", { length: 255 }).notNull(),
  returnId: varchar("return_id", { length: 255 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  reason: varchar("reason", { length: 255 }),
  method: varchar("method", { length: 50 }), // original_payment, store_credit, manual
  transactionId: varchar("transaction_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"), // pending, completed, failed
  processedBy: varchar("processed_by", { length: 255 }),
  notes: text("notes"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Shipping Labels
export const shippingLabels = mysqlTable("shipping_labels", {
  id: varchar("id", { length: 255 }).primaryKey(),
  orderId: varchar("order_id", { length: 255 }).notNull(),
  carrier: varchar("carrier", { length: 100 }).notNull(), // ups, fedex, usps, dhl
  service: varchar("service", { length: 100 }), // ground, express, overnight
  trackingNumber: varchar("tracking_number", { length: 255 }).notNull(),
  labelUrl: varchar("label_url", { length: 500 }),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: json("dimensions"), // {length, width, height}
  status: varchar("status", { length: 50 }).default("created"), // created, printed, shipped, delivered
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Admin users
export const adminUsers = mysqlTable("admin_users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  roleId: varchar("roleId", { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});
// Admin roles
export const adminRoles = mysqlTable("admin_roles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  permissions: text("permissions").notNull(),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});

// Admin logs
export const adminLogs = mysqlTable("admin_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  adminId: varchar("adminId", { length: 255 }).notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  details: text("details"),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

// Application Settings
export const settings = mysqlTable("settings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(), // e.g., 'stock_management_enabled'
  value: text("value").notNull(), // JSON string for complex values
  type: varchar("type", { length: 50 }).default("string"), // string, boolean, number, json
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const usersRelations = relations(user, ({ many }) => ({
  orders: many(orders),
  returns: many(returns),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  subcategories: many(subcategories),
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  variants: many(productVariants),
  inventory: many(productInventory),
  orderItems: many(orderItems),
  productAddons: many(productAddons),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  inventory: many(productInventory),
  orderItems: many(orderItems),
}));

export const productInventoryRelations = relations(productInventory, ({ one, many }) => ({
  product: one(products, {
    fields: [productInventory.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productInventory.variantId],
    references: [productVariants.id],
  }),
  stockMovements: many(stockMovements),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  inventory: one(productInventory, {
    fields: [stockMovements.inventoryId],
    references: [productInventory.id],
  }),
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [stockMovements.variantId],
    references: [productVariants.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  orderItems: many(orderItems),
  returns: many(returns),
  refunds: many(refunds),
  shippingLabels: many(shippingLabels),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
  returnItems: many(returnItems),
}));

export const returnsRelations = relations(returns, ({ one, many }) => ({
  order: one(orders, {
    fields: [returns.orderId],
    references: [orders.id],
  }),
  user: one(user, {
    fields: [returns.userId],
    references: [user.id],
  }),
  returnItems: many(returnItems),
  refunds: many(refunds),
}));

export const returnItemsRelations = relations(returnItems, ({ one }) => ({
  return: one(returns, {
    fields: [returnItems.returnId],
    references: [returns.id],
  }),
  orderItem: one(orderItems, {
    fields: [returnItems.orderItemId],
    references: [orderItems.id],
  }),
  product: one(products, {
    fields: [returnItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [returnItems.variantId],
    references: [productVariants.id],
  }),
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  order: one(orders, {
    fields: [refunds.orderId],
    references: [orders.id],
  }),
  return: one(returns, {
    fields: [refunds.returnId],
    references: [returns.id],
  }),
}));

export const shippingLabelsRelations = relations(shippingLabels, ({ one }) => ({
  order: one(orders, {
    fields: [shippingLabels.orderId],
    references: [orders.id],
  }),
}));

export const variationAttributesRelations = relations(variationAttributes, ({ many }) => ({
  values: many(variationAttributeValues),
}));

export const variationAttributeValuesRelations = relations(variationAttributeValues, ({ one }) => ({
  attribute: one(variationAttributes, {
    fields: [variationAttributeValues.attributeId],
    references: [variationAttributes.id],
  }),
}));

export const addonGroupsRelations = relations(addonGroups, ({ many }) => ({
  addons: many(addons),
}));

export const addonsRelations = relations(addons, ({ many, one }) => ({
  productAddons: many(productAddons),
  group: one(addonGroups, {
    fields: [addons.groupId],
    references: [addonGroups.id],
  }),
}));

export const productAddonsRelations = relations(productAddons, ({ one }) => ({
  product: one(products, {
    fields: [productAddons.productId],
    references: [products.id],
  }),
  addon: one(addons, {
    fields: [productAddons.addonId],
    references: [addons.id],
  }),
}));

export const adminUsersRelations = relations(adminUsers, ({ one, many }) => ({
  role: one(adminRoles, {
    fields: [adminUsers.roleId],
    references: [adminRoles.id],
  }),
  logs: many(adminLogs),
}));

export const adminRolesRelations = relations(adminRoles, ({ many }) => ({
  users: many(adminUsers),
}));

export const adminLogsRelations = relations(adminLogs, ({ one }) => ({
  admin: one(adminUsers, {
    fields: [adminLogs.adminId],
    references: [adminUsers.id],
  }),
}));