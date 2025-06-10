# SaladStop Chatbot Application - Functional Specification

## 1. Executive Summary

### 1.1 Application Overview

The SaladStop Chatbot Application is an AI-powered conversational ordering system that enables customers to order customized salads, bowls, and wraps through natural language interaction. The system integrates with existing SaladStop and HeyBo platforms to provide personalized recommendations, manage orders, and facilitate seamless checkout experiences.

### 1.2 Key Features

- **Multi-brand Support**: SaladStop (salads/wraps) and HeyBo (warm grain bowls)
- **AI-Powered Recommendations**: Personalized bowl suggestions based on preferences using SageMaker ML engine
- **Real-time Ingredient Availability**: Location and time-based ingredient checking
- **Multiple Ordering Paths**: Signature bowls, favorites, recent orders, and create-your-own
- **Flexible Authentication**: Support for registered users, guest users (OTP), and unauthenticated redirects
- **FAQ Knowledge Base**: Embedded document retrieval using Amazon Bedrock and OpenSearch

## 2. System Architecture

### 2.1 High-Level Architecture

```
Frontend (Web/Mobile) ↔ API Gateway ↔ AWS Lambda ↔ Chatbot Agent
                                                         ↓
                                              Tool Management Layer
                                                         ↓
        ┌─────────────────────────────────────────────────────────────┐
        │  Backend Services & Data Sources                             │
        ├─────────────────────────────────────────────────────────────┤
        │ • Vendor APIs (Location/Menu)                               │
        │ • PostgreSQL Database (Vendor - Read Only)                  │
        │ • GenAI Database (Session/Cart/Ratings)                     │
        │ • Amazon Bedrock (Knowledge Base)                           │
        │ • SageMaker (Recommendation Engine)                         │
        │ • OpenSearch (FAQ Embeddings)                               │
        │ • CloudFront (Caching Layer)                                │
        └─────────────────────────────────────────────────────────────┘
```

### 2.2 Core Components

- **Chatbot Agent**: Conversational AI engine for intent recognition and response generation
- **Tool Management System**: 12 specialized tools for different operations
- **Session Management**: Real-time state management for user interactions
- **Recommendation Engine**: ML-powered personalized suggestions using SageMaker
- **Knowledge Base**: FAQ retrieval using semantic search with Amazon Bedrock

## 3. Authentication & User Management

### 3.1 User Types & Authentication Flow

#### 3.1.1 Registered Users

- **Authentication**: Platform token validation via existing SaladStop/HeyBo systems
- **Token Validation**: Platform API endpoint integration (confirmed approach)
- **Data Access**: Full order history, favorites, preferences

#### 3.1.2 Guest Users (OTP-based)

- **Mobile Number Collection**: Handled via existing website API (no additional collection needed)
- **OTP Flow**:
  1. User requests OTP through existing website mechanism
  2. System sends OTP to user's mobile number
  3. User submits received OTP within 10-minute window
  4. System verifies OTP with established retry limits
  5. User gains verified guest status with 24-hour session
- **OTP Security Limits**:
  - **Generation Limit**: 3 OTP generations per hour per mobile number
  - **Attempt Limit**: 5 verification attempts per OTP
  - **Lockout**: Progressive lockout after limits exceeded

#### 3.1.3 Unauthenticated Users

- **Behavior**: Redirect to login page
- **No ordering capabilities until authenticated**

### 3.2 Streamlined Session Management

#### 3.2.1 Session Data Structure

```json
{
  "session_id": "unique_identifier",
  "user_id": "customer_id",
  "user_type": "registered|guest|unauthenticated",
  "device_id": "device_specific_identifier",
  "created_at": "timestamp",
  "last_activity": "timestamp",
  "expires_at": "timestamp",
  "user_current_step": "step_identifier",
  "order_time": "scheduled_datetime",
  "pickup_location_type": "station|outlet",
  "location": "location_id",
  "selections": [],
  "cart": [],
  "preferences": {}
}
```

#### 3.2.2 Device-Specific Session Management

- **Session Strategy**: Device-specific sessions (no cross-device conflicts)
- **Data Retention**: 24-hour automatic cleanup policy for session data
- **Session Timeout**: Standard web session timeout with user notification
- **Multi-Brand Separation**: Separate sessions per brand website (SaladStop vs HeyBo)

## 4. Core Functional Flows

### 4.1 User Onboarding Flow

#### 4.1.1 Entry Points

- Direct chatbot access (authenticated users)
- Login redirect (unauthenticated users)
- OTP verification (guest users)

#### 4.1.2 Enhanced Post-Authentication Flow

1. **Previous Order Rating** (if applicable):
   - **Trigger**: User has completed previous order (status = 130) AND order hasn't been rated
   - **Rating Interface Options**:
     - **Overall Order**: 1-5 stars + optional comments
     - **CYO Bowls**: Individual thumbs up/down per custom bowl (if order contains CYO items)
     - **Flexible Engagement**: User can rate overall only, CYO bowls only, both, or skip entirely
   - **Data Capture**:
     - Order ID, overall rating (if provided), comments (if provided)
     - Individual CYO bowl ratings (if provided), flags for what was rated
   - **Storage**: Ratings stored in GenAI database for chef portal access
   - **Business Value**:
     - Separated feedback streams (bowl quality vs. service quality)
     - Reduced rating fatigue through optional engagement
     - Targeted improvements for different teams

2. **Welcome & Personalization**:
   - Brand-specific greeting message
   - Display ordering path options based on user history

### 4.2 FAQ System

#### 4.2.1 Capabilities

- Natural language query processing using Amazon Bedrock
- Semantic search through knowledge base stored in OpenSearch
- Document-based response generation
- Chatbot capability inquiries

#### 4.2.2 Implementation

- Documents stored in Amazon S3
- Embeddings created and stored in OpenSearch
- Bedrock KnowledgeBase for retrieval
- Context-aware response generation

## 5. Ordering System

### 5.1 Enhanced Ordering Path Selection

The system provides four distinct ordering approaches with 5-item display limits:

#### 5.1.1 Path A: Signature Bowls/Wraps

- **SaladStop**: Signature salads (category 1) and wraps (category 2)
- **HeyBo**: Warm grain bowls (category 2)
- Pre-designed chef-curated options
- Real-time ingredient availability validation at selected location

#### 5.1.2 Path B: Recent Orders

- User's recent order history from order database
- **Display Logic**: Show most recent 5 completed orders (status = 130)
- **Query**: `ORDER BY created_at DESC LIMIT 5`
- **Fallback**: If no recent orders exist, redirect to other ordering paths
- **Reorder Features**:
  - Load original order composition
  - Validate ingredient availability at current location
  - Suggest substitutions for unavailable ingredients

#### 5.1.3 Path C: Favorites (Read-Only Integration)

- **Data Source**: `customer_customerfavoritemenu` table (vendor database read-only)
- **Display Logic**: Show most recent 5 favorites `ORDER BY created_at DESC LIMIT 5`
- **Integration**: Website-managed favorites accessible in chatbot for reordering
- **Validation**: Check ingredient availability at selected location
- **Fallback**: Redirect to other ordering paths if no favorites exist
- **Business Benefits**:
  - Reduced decision fatigue with manageable options
  - Latest saved preferences prioritized
  - Performance optimization with smaller query results

#### 5.1.4 Path D: Create Your Own (CYO) with ML Integration

- **ML Recommendations**: Call SageMaker ML engine for personalized bowl suggestions
- **Starting Options**:
  - Select from 5 ML-generated recommendations as starting points
  - Manual building from scratch if ML unavailable or user preference
- **Features**:
  - Real-time ingredient availability checking
  - Dietary preference filtering
  - Weight management with 80% threshold warnings (720g)
  - Nutritional constraint application

#### 5.1.5 Path E: ML-Powered Recommendations

- AI-powered personalized bowl suggestions using SageMaker
- Based on user preferences, dietary restrictions, and location availability
- Immediate fallback to cached popular items/signature bowls when ML unavailable
- 3-second timeout with background processing continuation

### 5.2 Common Ordering Flow

1. **Location Type Selection**: Station or outlet selection
2. **Location Selection**: Available locations based on location type using CloudFront cached APIs
3. **Time Selection**: ASAP or scheduled ordering
4. **Ingredient Availability**: Real-time checking using vendor database based on selected location and time
5. **Path-Specific Flow**: Execute chosen ordering method
6. **Customization**: Bowl editing and modification
7. **Add-ons**: Optional add-on selection (maximum one add-on per order item)
8. **Cart Management**: Item addition and cart operations
9. **Upselling**: Additional item suggestions (order-level, not per item)
10. **Checkout**: Final order handoff to platform

### 5.3 Bowl Composition Rules

#### 5.3.1 SaladStop CYO Salads

- **Greens**: 0-2 selections
- **Protein Bundles**: Unlimited
- **Standard Toppings**: 0-6 selections
- **Premium Toppings**: Unlimited
- **Extra Standard Toppings**: Unlimited
- **Sprinkles**: 0-1 selection
- **Dressings**: 0-2 selections
- **Make-it-a-Meal**: 0-1 selection

#### 5.3.2 SaladStop CYO Wraps

- **Base**: 1 selection (required)
- **Greens**: 0-2 selections
- **Protein Bundles**: Unlimited
- **Standard Toppings**: 0-6 selections
- **Premium Toppings**: Unlimited
- **Extra Standard Toppings**: Unlimited
- **Sprinkles**: 0-1 selection
- **Dressings**: 0-2 selections
- **Make-it-a-Meal**: 0-1 selection

#### 5.3.3 HeyBo Warm Grain Bowls

- **Base**: 1 selection (required)
- **Protein**: 0-1 selection
- **Extra Protein**: Unlimited
- **Sides**: 0-3 selections
- **Extra Sides**: Unlimited
- **Dip**: 0-1 selection
- **Garnish**: 0-1 selection
- **Sauce**: 0-1 selection

#### 5.3.4 Weight Management

- **Maximum bowl weight**: 900g (system enforced)
- **Warning threshold**: 720g (80% of maximum) with user notification
- **Minimum weight**: Ensured using volume metadata (approximately 400g)
- **User Notification**: Clear warning when approaching weight limits with suggestions to optimize

## 6. Recommendation Engine

### 6.1 Production-Ready ML-Powered Personalization

#### 6.1.1 SageMaker Integration with Robust Fallback

**Primary ML Engine**:

- SageMaker endpoint with optimized timeout handling
- Background processing for complex recommendations
- Immediate fallback to cached/rule-based suggestions when needed

**Fallback Strategy** (Immediate Response):

1. **Cached Recommendations**: Pre-computed popular items by location/time
2. **Signature Bowls**: Brand-specific popular options
3. **Rule-Based Logic**: Simple preference matching
4. **Default Options**: Basic menu presentation

#### 6.1.2 Simplified Recommendation Logic

**Input Parameters** (Streamlined):

```json
{
  "ShopName": ["ss cyo", "heybo"],
  "Cuisine": [],
  "NutrientFilters": [{"Nutrient": "Protein", "Range": {"Min":10,"Max":60}}],
  "Ingredients": {"Include": [], "Exclude": [], "Extra": []},
  "Price": {"Target": 15},
  "AllergenFilters": ["nuts", "dairy"],
  "DietFilters": ["vegan", "vegetarian"],
  "LocationContext": {
    "location_id": "selected_location",
    "available_ingredients": []
  }
}
```

**Output**: 5 recommendations with immediate fallback if ML processing takes >3 seconds

### 6.2 Streamlined Real-Time Processing

- **Ingredient Availability**: Best-effort validation with user notification of any issues
- **Pricing**: Best-effort calculation with user notification if prices may have changed
- **Inventory Management**: No inventory locking - handle overselling at order submission
- **Weight Validation**: Real-time tracking with 80% threshold warnings

## 7. Tool Architecture

### 7.1 Enhanced 12 Core Tools with User Journey Integration

#### 7.1.1 FAQ Retrieval Tool

- **Purpose**: Knowledge base query processing using Amazon Bedrock
- **Input**: session_id, user_id, query
- **Implementation**: Semantic search with keyword fallback
- **Context Integration**: Considers current order state for context-aware responses
- **Failure Handling**: Generic helpful response with manual escalation option

#### 7.1.2 Locations Availability Tool

- **Purpose**: Retrieve operational locations with intelligent prioritization
- **Input**: order_time, pickup_location_type, user_gps_data (if available)
- **Enhanced Features**:
  - Live location integration from website local storage
  - Distance calculation using Haversine formula (when GPS available)
  - Last ordered location prioritization for returning users
- **Caching Strategy**: 5-15 minute cache with acceptable staleness
- **Failure Message**: "Location information temporarily unavailable. Please try again."

#### 7.1.3 Ingredients Availability Tool  

- **Purpose**: Best-effort ingredient availability checking
- **Implementation**: Accept potential staleness, notify users of any issues
- **No Inventory Locking**: Handle overselling at final order submission
- **Database Query**:

```sql
SELECT i.name, ic.name AS category_name, isc.name AS subcategory_name,
       CASE WHEN gdi.ingredient_id IS NOT NULL THEN false ELSE true END AS available
FROM public.gogreenfood_ingredient i
LEFT JOIN public.gogreenfood_ingredientcategory ic ON i.ingredient_category_id = ic.id
LEFT JOIN public.gogreenfood_ingredientsubcategory isc ON i.ingredient_subcategory_id = isc.id
LEFT JOIN public.gglmenu_gglocationdisabledingredient gdi ON (
    gdi.ingredient_id = i.id AND gdi.gglocation_id = $1 AND gdi.gglocation_type = $2
)
WHERE i.is_deleted = false AND i.exclude_in_CYO = false;
```

- **User Notification**: "Ingredient availability shown is best-effort. Final confirmation at checkout."

#### 7.1.4 Recent Orders Retrieval Tool

- **Purpose**: Retrieve recent order history with 5-item limit
- **Filter**: Completed orders (status = 130)
- **Query**: `ORDER BY created_at DESC LIMIT 5`
- **Enhanced Features**:
  - Ingredient availability validation for reorders
  - Price change notifications
  - Simple recreation without complex validation

#### 7.1.5 Favorites Retrieval Tool

- **Purpose**: Access user's saved favorite items from website system
- **Data Source**: `customer_customerfavoritemenu` table (vendor database read-only)
- **Query**: `ORDER BY created_at DESC LIMIT 5`
- **Validation**: Check ingredient availability at selected location
- **Integration**: Website-managed favorites accessible for chatbot reordering
- **Fallback**: Redirect to other ordering paths if no favorites exist

#### 7.1.6 ML Recommendation Tool

- **Purpose**: AI recommendations with immediate fallback
- **Primary**: SageMaker endpoint with background processing
- **Timeout**: 3-second timeout with immediate fallback presentation
- **Fallback Hierarchy**:
  1. Cached popular items by location/time
  2. Signature bowls
  3. Basic menu presentation
- **User Experience**: Seamless experience regardless of ML performance

#### 7.1.7 Selection Management Tool

- **Purpose**: Pre-cart item management with weight warnings
- **Weight Tracking**: Alert users at 720g (80% of 900g limit) via chat warnings
- **Warning System**: Informational only - no enforcement
- **Pricing**: Best-effort calculation with change notifications
- **Weight Warning Examples**:
  - At 720g: "Your bowl is getting quite full! You're at 80% of the maximum weight."
  - At 900g: "This is a very large bowl - you might want to consider splitting into two orders."

#### 7.1.8 Cart Management Tool

- **Purpose**: Simple cart operations with device-specific storage
- **Session Storage**: Device-specific with 24-hour cleanup
- **Price Updates**: Best-effort with user notification of changes
- **Recovery**: Cart recovery on page refresh using local storage backup
- **No Cross-Device Sync**: Each device maintains independent cart

#### 7.1.9 Add-ons Tool

- **Purpose**: Simple add-on presentation
- **Business Rule**: One add-on per order item (enforced at UI level)
- **Data Source**: `gogreenfood_preference` table (type_id = 2)
- **Integration**: Standard database lookup with caching

#### 7.1.10 Signature Bowls Tool

- **Purpose**: Present pre-designed options
- **APIs**:
  - SaladStop: `https://dtymvut4pk8gt.cloudfront.net/api/v1/gglocation-menus/`
  - HeyBo: `https://d2o7qvkenn9k24.cloudfront.net/api/v1/gglocation-menus/`
- **Availability**: Best-effort ingredient checking
- **Caching**: Accept staleness with periodic updates
- **Substitution**: Handle unavailable ingredients at order submission

#### 7.1.11 Upselling Tool

- **Purpose**: Simple additional item suggestions
- **Logic**: Basic rule-based suggestions using popular items API
- **Timing**: Pre-checkout presentation
- **Scope**: Order-level suggestions (not per individual item)
- **Integration**: Website popular items API (endpoint to be confirmed)

#### 7.1.12 Session Tool

- **Purpose**: Basic session state management
- **Operations**: Reset, clear, basic state tracking
- **Device-Specific**: No cross-device complications
- **Cleanup**: Automatic 24-hour data retention

### 7.2 Simplified Error Handling Strategy

- **Approach**: Pass-through API errors with user-friendly messaging
- **Fallbacks**: Simple, immediate alternatives
- **User Communication**: Clear, honest messaging about system limitations
- **Escalation**: Manual support escalation for complex issues

## 8. Data Management

### 8.1 Enhanced Database Architecture with Consistency Management

### 8.1 Enhanced Database Architecture with Query Specifications

#### 8.1.1 Vendor Database (PostgreSQL) - Read Only with Optimized Queries

**Key Tables**:

- `gogreenfood_ingredient`: Master ingredient data with stock tracking
- `gogreenfood_ingredientcategory`: Ingredient categorization
- `gogreenfood_ingredientsubcategory`: Ingredient subcategorization  
- `customer_customerfavoritemenu`: User favorites
- `orders_order`: Order history and status
- `gglmenu_gglocationdisabledingredient`: Location-specific ingredient availability
- `gogreenfood_preference`: Add-ons and preferences
- `location`: Location master data with coordinates

**Critical Query Specifications**:

**Recent Orders Query**:

```sql
-- Get user's most recent 5 completed orders
SELECT order_id, order_details, created_at, total_amount
FROM orders_order 
WHERE customer_id = $1 
  AND status = 130
ORDER BY created_at DESC
LIMIT 5;
```

**Favorites Query**:

```sql
-- Get user's most recent 5 favorite items
SELECT favorite_id, menu_item_id, custom_menusnapshot_id, 
       favorite_name, created_at
FROM customer_customerfavoritemenu 
WHERE customer_id = $1
ORDER BY created_at DESC
LIMIT 5;
```

**Last Ordered Location Query** (for location prioritization):

```sql
-- Get user's most recent outlet order
SELECT DISTINCT o.outlet_location_id, l.name, l.address 
FROM orders_order o
JOIN location l ON o.outlet_location_id = l.id
WHERE o.customer_id = $1 
  AND o.outlet_location_id IS NOT NULL
  AND o.status = 130
ORDER BY o.created_at DESC
LIMIT 1;
```

**Nearest Locations Query** (when GPS available):

```sql
-- Calculate distances using Haversine formula
SELECT id, name, address, latitude, longitude,
  (6371 * acos(cos(radians($1)) * cos(radians(latitude)) 
   * cos(radians(longitude) - radians($2)) 
   + sin(radians($1)) * sin(radians(latitude)))) AS distance
FROM location 
WHERE location_type = $3 AND is_active = true
ORDER BY distance
LIMIT 3;
```

**Access Optimization**:

- Connection pooling (max 50 connections)
- Read-only access with query optimization
- Prepared statements for frequent queries
- 5-item limit queries for performance optimization

#### 8.1.2 GenAI Database with Enhanced Structure

**Purpose**: Session management, cart storage, ratings, analytics
**Enhanced Schema**:

```sql
-- Sessions table with recovery support
CREATE TABLE user_sessions (
    session_id UUID PRIMARY KEY,
    user_id VARCHAR(100),
    user_type VARCHAR(20),
    session_data JSONB,
    backup_data JSONB, -- For recovery purposes
    created_at TIMESTAMP DEFAULT NOW(),
    last_activity TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    device_info JSONB,
    recovery_token VARCHAR(255)
);

-- Enhanced cart management
CREATE TABLE user_carts (
    cart_id UUID PRIMARY KEY,
    session_id UUID REFERENCES user_sessions(session_id),
    cart_data JSONB,
    total_amount DECIMAL(10,2),
    item_count INTEGER,
    validation_hash VARCHAR(255), -- For integrity checking
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Rating system with detailed tracking
CREATE TABLE order_ratings (
    rating_id UUID PRIMARY KEY,
    order_id VARCHAR(100),
    user_id VARCHAR(100),
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    item_ratings JSONB,
    delivery_rating INTEGER,
    comments TEXT,
    rating_context JSONB, -- Store context like device, location, etc.
    created_at TIMESTAMP DEFAULT NOW()
);

-- Error tracking for system improvement
CREATE TABLE system_errors (
    error_id UUID PRIMARY KEY,
    session_id UUID,
    error_type VARCHAR(100),
    error_details JSONB,
    user_impact_level VARCHAR(20),
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 8.2 Simplified Data Management & Caching

#### 8.2.1 Practical Caching Strategy

**Multi-Layer Caching with Acceptable Staleness**:

```
CloudFront (Global CDN)
├── Static content: 24 hours TTL
├── Location data: 15 minutes TTL
└── Menu data: 15 minutes TTL

Application Cache
├── Ingredient availability: 5-15 minutes TTL
├── User sessions: Device-specific, 24-hour cleanup
├── ML recommendations: 30 minutes TTL
└── Frequent queries: 5-15 minutes TTL
```

**Cache Strategy**:

- **Accept Staleness**: 5-15 minute cache windows with user notification of potential changes
- **No Real-time Invalidation**: Simpler periodic refresh approach
- **User Communication**: Clear messaging about best-effort data accuracy

#### 8.2.2 Simplified Data Consistency

**Approach**: Best-effort consistency with user notification

- **Price Validation**: Best-effort with change notifications
- **Inventory**: No locking, handle overselling at submission
- **Session Data**: Device-specific with automatic cleanup
- **Error Handling**: Clear user communication about data limitations

### 8.2 Data Storage Clarifications Needed

#### 8.2.1 Rating Storage

- **Requirement states**: "Only read actions in vendor database"
- **But also mentions**: Rating storage mentions vendor database
- **Clarification needed**: Where are ratings actually stored?
- **Assumption**: Ratings go to GenAI database based on requirements

#### 8.2.2 Custom Bowl Storage

- **Question**: Only customized bowls eligible for favorites?
- **Custom bowls have**: custom_menusnapshot_id
- **Clarification needed**: Can signature bowls be favorited?

## 9. User Interface Design

### 9.1 Chat Interface Components

- **Welcome Screen**: Brand-specific theming (SaladStop vs HeyBo)
- **Authentication Interface**: OTP input for guest users
- **Conversation Flow**: Natural language interaction with quick action buttons
- **Bowl Visualization**: Realistic bowl images with ingredient layering per brand rules
- **Rating Interface**: Star rating system with optional comment fields

### 9.2 Bowl Visualization & Details

#### 9.2.1 Image Display

- **SaladStop**: Ingredient layering and placement rules applied
- **HeyBo**: Brand-specific styling standards
- Realistic bowl representation

#### 9.2.2 Information Display (On Image Click)

**SaladStop**:

- Nutritional Information
- Ingredient Sourcing Info
- Carbon Footprint Data

**HeyBo**:

- Nutritional Information
- Ingredient Sourcing Info
- **Note**: Carbon footprint data NOT shown for HeyBo

### 9.3 Mobile Responsiveness

- Responsive design for mobile and desktop
- Touch-optimized interactions
- Progressive Web App capabilities

## 10. Integration Points

### 10.1 External APIs

#### 10.1.1 SaladStop APIs

- **Locations**: `https://dtymvut4pk8gt.cloudfront.net/api/v1/locations/`
- **Menu Groups**: `https://dtymvut4pk8gt.cloudfront.net/api/v1/gglocation-menus/`
- **Authentication**: Method to be confirmed
- **Caching**: CloudFront caching recommended

#### 10.1.2 HeyBo APIs

- **Locations**: `https://d2o7qvkenn9k24.cloudfront.net/api/v1/locations/`
- **Menu Groups**: `https://d2o7qvkenn9k24.cloudfront.net/api/v1/gglocation-menus/`
- **Authentication**: Method to be confirmed
- **Caching**: CloudFront caching recommended

### 10.2 Authentication Integration

- **Registered Users**: Platform token validation (API details required)
- **Process**: Token validation method to be confirmed
- **User Profile**: Retrieval method to be defined

### 10.3 Final Order Handoff - PENDING CUSTOMER INPUT

#### 10.3.1 Current Status

**IMPLEMENTATION BLOCKER**: Final order handoff API payload format still needs to be obtained from customer.

#### 10.3.2 Required Information

- **API Endpoint**: Final handoff destination URL
- **Payload Format**: Exact JSON structure required by platform
- **Authentication**: Required headers and authentication method
- **Response Handling**: Expected response format and error codes
- **Retry Logic**: Platform requirements for failed handoff scenarios

#### 10.3.3 Preliminary Handoff Structure (Subject to Confirmation)

```json
{
  "session_id": "uuid",
  "user_id": "customer_id",
  "platform": "saladstop|heybo",
  "order_details": {
    "pickup_time": "iso_datetime",
    "location": {
      "id": "location_id",
      "type": "station|outlet"
    },
    "items": [
      {
        "item_type": "cyo_salad|signature_bowl|wrap",
        "customizations": [...],
        "add_ons": [...],
        "total_price": 15.50
      }
    ],
    "grand_total": 20.17
  },
  "handoff_timestamp": "iso_datetime"
}
```

**Note**: This structure is preliminary and will be finalized once customer provides the exact API specification.

## Critical Requirements Status & Integration Points

### ✅ RESOLVED - Ready for Implementation

**Authentication & Integration**

- ✅ Mobile Number Collection: Handled via existing website API
- ✅ Token Validation: Platform API endpoint confirmed
- ✅ Favorites: Website-managed, read-only access via `customer_customerfavoritemenu` table
- ✅ Live Location: GPS data from website local storage (no additional API calls)

**Session & Data Management**  

- ✅ Session Collision: Device-specific sessions
- ✅ Data Retention: 24-hour cleanup policy
- ✅ Multi-Brand: Separate websites (no switching needed)
- ✅ 5-Item Display Logic: Consistent limits for recent orders and favorites

**Inventory & Ordering**

- ✅ Inventory Locking: No locking, handle overselling at submission  
- ✅ Pricing Validation: Best effort with user notification
- ✅ Weight Tracking: Warning at 80% threshold (720g) - informational only
- ✅ Business Rules: Advisory warnings via chat, no enforcement

**Performance & Reliability**

- ✅ Cache Strategy: Accept staleness with 5-15 min cache
- ✅ API Rate Limiting: Pass-through errors to users
- ✅ ML Endpoint Timeouts: 3-second timeout with immediate fallback
- ✅ System Monitoring: Basic logging + manual escalation

**User Experience Features**

- ✅ Rating System: Flexible overall + CYO bowl ratings with skip options
- ✅ Location Intelligence: GPS-based nearest locations + last ordered prioritization
- ✅ Path Integration: All 5 ordering paths (Signature, Recent, Favorites, CYO, ML Recommendations)

**Security**

- ✅ OTP Retry Limits: 3 generations/hour, 5 attempts/OTP

### 🔗 INTEGRATION REQUIREMENTS

**Popular Items API Integration** (for upselling and fallbacks):

- API Endpoint: To be confirmed with customer
- Data Format: JSON structure with popular item IDs and metadata
- Caching Strategy: 15-30 minute TTL
- Fallback: Skip upselling if API unavailable

**Expected Popular Items Data Structure**:

```json
{
  "popular_items": [
    {
      "item_id": "signature_bowl_id",
      "item_type": "signature_salad|signature_wrap|signature_bowl",
      "popularity_score": 85,
      "location_specific": false,
      "brand": "saladstop|heybo"
    }
  ],
  "last_updated": "timestamp",
  "cache_duration": 1800
}
```

### ⏳ PENDING - Final Implementation Blocker

**Order Handoff API**:

- Final handoff API payload format (awaiting customer input)
- Required for completing the checkout flow integration

### 🚀 Implementation Readiness

**Status**: 95% Ready for Development

- All major edge cases resolved through specific architectural decisions
- Comprehensive user journey flows documented with database queries
- Tool architecture simplified for production deployment
- Only final handoff API specification needed to complete implementation

**Development Priority**:

1. Implement core 12 tools with documented query specifications
2. Build user journey flows with live location integration
3. Implement rating system with flexible engagement options
4. Integrate with existing website APIs for favorites and location data
5. Finalize order handoff once API specification received

---

This functional specification covers all the core requirements while identifying areas that need additional clarification for complete implementation. The architecture supports the four ordering paths, comprehensive tool system, and integration requirements as specified in the original documents.
