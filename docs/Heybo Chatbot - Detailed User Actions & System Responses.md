# SaladStop Chatbot - User Journey Actions Detail

## Persona 1: Registered User Journey

### Phase 1: Authentication & Setup

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **Entry** | Access chatbot URL | Check authentication status | Session data from platform token | Redirect to login if invalid |
| **Token Validation** | Automatic (token in header/cookie) | Validate with platform API | Platform token → User profile data | Invalid token → Login redirect |
| **Previous Order Check** | N/A | Query order database | Check for status=130 & not rated | Continue if no previous order |
| **Rating Prompt** | **Flexible Rating Options:**<br/>- Overall order: 1-5 stars + comments (optional)<br/>- CYO bowls: Individual thumbs up/down (optional)<br/>- Can choose any combination or skip all | Save provided ratings to GenAI database | Order ID, overall rating (if provided), comments (if provided), CYO bowl ratings (if provided), flags for what was rated | Allow partial rating or complete skip |

### Phase 2: Welcome & Path Selection

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **Welcome** | Review ordering options | Display brand-specific welcome | User preferences, order history | Show default options |
| **Path Selection** | Choose: Signature/Recent/CYO/Recommendations/FAQ | Initialize selected flow | Path preference tracking | Default to signature if unclear |

### Phase 3: Location & Time Setup (All Ordering Paths)

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **Location Type** | Select Station or Outlet | Filter available locations | CloudFront cached location data | Show all if filter fails |
| **Live Location Check** | N/A (automatic) | Check website local storage for user location | GPS coordinates from browser storage | Continue to manual selection if unavailable |
| **Location Selection** | **If live location available:** Choose from up to 3 nearest locations<br/>**If no live location:** Choose from all locations with last ordered outlet at top | **With live location:** Calculate distances and show 3 nearest<br/>**Without live location:** Query user's last ordered outlet and prioritize in list | Validate location operational hours and distance calculations | Show all locations if calculation fails |
| **Time Selection** | Choose ASAP or schedule specific time | Set order timing context | Validate against location hours | Suggest available times |

## Persona 2: Guest User Journey

### Phase 1: Mobile Verification

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **Mobile Collection** | Enter mobile number | Validate format via website API | 10-digit validation, country code | Format correction prompts |
| **OTP Request** | Request OTP | Check generation limits & send OTP | 3 generations/hour limit | Lockout with progressive backoff |
| **OTP Entry** | Enter 6-digit OTP | Verify against sent OTP | 10-minute validity window | 5 attempts max, then lockout |
| **Session Creation** | N/A | Create 24-hour guest session | Device-specific session ID | Session recovery on device |

### Phase 2: Rating & Welcome (Same as Registered)

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **Previous Order Check** | N/A | Query by mobile number | Guest order history lookup | Continue if no history |
| **Rating/Welcome** | **Overall Order:** 1-5 stars + comments<br/>**CYO Bowls:** Thumbs up/down per bowl<br/>Same skip option available | Same as registered user flow | Same validation rules + CYO bowl identification | Same error handling |

#### 7.1.X Favorites Tool

- **Purpose**: Access user's saved favorite items from website system
- **Data Source**: customer_customerfavoritemenu table (vendor database)
- **Limit**: Most recent 5 favorites (ORDER BY created_at DESC LIMIT 5)
- **Validation**: Check ingredient availability at selected location
- **Fallback**: Redirect to other ordering paths if no favorites exist

## Favorites Integration & Popular Items API

### Favorites System Integration

| Component | Data Source | Database Table | Validation Required |
|-----------|-------------|----------------|-------------------|
| **User Favorites** | Vendor database (read-only) | customer_customerfavoritemenu | Ingredient availability at location |
| **Favorite Items** | Website favorites system | Links to menu items and custom bowls | Check if favorited items still exist |
| **Reorder Flow** | Same as recent orders | Standard ingredient validation | Substitution suggestions if unavailable |

### Popular Items API Integration

| Component | Data Source | API Endpoint | Fallback Strategy |
|-----------|-------------|--------------|-------------------|
| **CYO Manual Building** | Website popular ingredients API | To be confirmed with customer | Standard ingredient categories |
| **Upselling Suggestions** | Website popular items API | To be confirmed with customer | Skip upselling if API unavailable |
| **Default Recommendations** | Website popular items API | To be confirmed with customer | Show signature bowls menu |

### API Data Structure Requirements

```json
// Favorites query response
{
  "favorites": [
    {
      "favorite_id": "uuid",
      "item_type": "signature|custom",
      "menu_item_id": "item_id", // for signature items
      "custom_menusnapshot_id": "snapshot_id", // for custom bowls
      "favorite_name": "user_defined_name",
      "created_at": "timestamp"
    }
  ]
}

// Popular ingredients/items response  
{
  "popular_items": [
    {
      "item_id": "ingredient_or_item_id",
      "item_type": "ingredient|signature_item",
      "popularity_score": 85,
      "category": "protein|greens|toppings|etc",
      "brand": "saladstop|heybo"
    }
  ]
}
```

### Weight & Business Rule Management - Warning Only System

#### Chatbot Warning Approach

| Validation Type | System Behavior | User Experience | Enforcement Level |
|-----------------|-----------------|-----------------|-------------------|
| **Weight Limit (720g)** | Show chat warning message | Informational notification only | No enforcement - user can continue |
| **Weight Limit (900g)** | Show stronger chat warning | Stronger notification about maximum | Warning only - no hard stop |
| **Category Limits** | Chat notification about limits | Information about category constraints | Guidelines only - not enforced |
| **Business Rules** | Contextual chat messages | Helpful suggestions in conversation | Advisory only |

#### Warning Message Examples

```
Weight Warnings:
- At 720g: "Your bowl is getting quite full! You're at 80% of the maximum weight."
- At 900g: "This is a very large bowl - you might want to consider splitting into two orders."

Business Rule Warnings:
- Category limits: "Just so you know, most customers choose 1-2 dressings for optimal taste."
- Combination advice: "That's an interesting mix! Some customers prefer fewer protein types."
```

#### Key Principles

- **Informational Only**: All warnings are advisory, not blocking
- **User Choice**: Customers can proceed with any configuration they want
- **Chat Integration**: Warnings appear as natural conversation messages
- **No UI Blocking**: No pop-ups, modals, or form validation errors
- **Graceful Guidance**: Helpful suggestions without being restrictive

### 5-Item Display Logic for Recent Orders & Favorites

| Scenario | Display Behavior | User Experience | Database Query |
|----------|------------------|-----------------|----------------|
| **User has >5 recent orders** | Show most recent 5 orders only | Clean, focused list without overwhelming options | `ORDER BY created_at DESC LIMIT 5` |
| **User has ≤5 recent orders** | Show all available orders | Complete order history visible | Same query, returns all available |
| **User has >5 favorites** | Show most recent 5 favorites only | Latest saved preferences prioritized | `ORDER BY created_at DESC LIMIT 5` |
| **User has ≤5 favorites** | Show all favorites | Complete favorites list visible | Same query, returns all available |
| **No recent orders** | Redirect to other ordering paths | Seamless alternative flow | Query returns empty result |
| **No favorites** | Redirect to other ordering paths | Seamless alternative flow | Query returns empty result |

### Business Logic Benefits

- **Reduced Decision Fatigue**: Users see manageable number of options
- **Relevance Priority**: Most recent items are most likely to be reordered
- **Performance Optimization**: Smaller query results and faster UI rendering
- **Consistent UX**: Same 5-item limit across both recent orders and favorites
- **Mobile Friendly**: Shorter lists work better on mobile screens

---

| Scenario | Display Behavior | User Experience | Database Query |
|----------|------------------|-----------------|----------------|
| **User has >5 recent orders** | Show most recent 5 orders only | Clean, focused list without overwhelming options | `ORDER BY created_at DESC LIMIT 5` |
| **User has ≤5 recent orders** | Show all available orders | Complete order history visible | Same query, returns all available |
| **User has >5 favorites** | Show most recent 5 favorites only | Latest saved preferences prioritized | `ORDER BY created_at DESC LIMIT 5` |
| **User has ≤5 favorites** | Show all favorites | Complete favorites list visible | Same query, returns all available |
| **No recent orders** | Redirect to other ordering paths | Seamless alternative flow | Query returns empty result |
| **No favorites** | Redirect to other ordering paths | Seamless alternative flow | Query returns empty result |

### Business Logic Benefits

- **Reduced Decision Fatigue**: Users see manageable number of options
- **Relevance Priority**: Most recent items are most likely to be reordered
- **Performance Optimization**: Smaller query results and faster UI rendering
- **Consistent UX**: Same 5-item limit across both recent orders and favorites
- **Mobile Friendly**: Shorter lists work better on mobile screens

---

| Component | Data Source | API Endpoint | Fallback Strategy |
|-----------|-------------|--------------|-------------------|
| **ML Recommendation Fallback** | Website popular items API | To be confirmed with customer | Signature bowls if API unavailable |
| **Upselling Suggestions** | Website popular items API | To be confirmed with customer | Skip upselling if API unavailable |
| **Default Recommendations** | Website popular items API | To be confirmed with customer | Show signature bowls menu |

### Popular Items Integration Requirements

- **API Endpoint**: Specific endpoint for popular items to be provided by customer
- **Data Format**: JSON structure with popular item IDs and metadata
- **Caching Strategy**: Cache popular items with 15-30 minute TTL
- **Error Handling**: Graceful fallback to signature bowls when API unavailable
- **Location Filtering**: Popular items may be location-specific (to be confirmed)

### Popular Items Data Structure (Expected)

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

**Note**: Exact API specification and endpoint details pending customer input.

---

### Live Location Flow

| Condition | Data Source | Display Logic | User Experience | Error Handling |
|-----------|-------------|---------------|-----------------|----------------|
| **Live location available** | Website local storage (GPS coordinates) | Calculate distances to all locations of selected type, show 3 nearest | Simple selection from nearby options | Fall back to full list if distance calculation fails |
| **No live location** | User order history database | Query last ordered outlet location, display at top of full list | Last used location prominently displayed | Show alphabetical list if last order lookup fails |
| **New user + no location** | CloudFront cached location API | Display all locations alphabetically | Standard location picker | Basic error messaging if API fails |

### Location Distance Calculation

| Step | System Action | Data Requirements | Performance Considerations |
|------|---------------|-------------------|---------------------------|
| **Get User Location** | Read from website local storage | GPS coordinates (latitude, longitude) | No API call needed - local data only |
| **Calculate Distances** | Haversine formula for each location | Location coordinates from database | Pre-computed distances cached for performance |
| **Sort & Filter** | Sort by distance, take top 3 | Location operational status | Real-time status check before display |
| **Display Results** | Show with estimated distance/travel time | Location details + availability | Graceful degradation if details unavailable |

### Database Queries for Location Selection

#### Last Ordered Outlet Query  

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

#### Recent Orders Query

```sql
-- Get user's most recent 5 completed orders
SELECT order_id, order_details, created_at, total_amount
FROM orders_order 
WHERE customer_id = $1 
  AND status = 130
ORDER BY created_at DESC
LIMIT 5;
```

#### Favorites Query  

```sql
-- Get user's most recent 5 favorite items
SELECT favorite_id, menu_item_id, custom_menusnapshot_id, 
       favorite_name, created_at
FROM customer_customerfavoritemenu 
WHERE customer_id = $1
ORDER BY created_at DESC
LIMIT 5;
```

#### Nearest Locations Query  

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

---

### Rating Interface Logic

| Condition | Display | User Actions | Data Captured |
|-----------|---------|--------------|---------------|
| **Previous order has CYO bowls** | Overall order rating (1-5 stars + comments) + Individual CYO bowl ratings (thumbs up/down per bowl) | **Can choose any combination:**<br/>- Rate overall only<br/>- Rate CYO bowls only<br/>- Rate both overall AND CYO bowls<br/>- Skip all ratings | Order ID, overall rating (if provided), comments (if provided), individual CYO bowl ratings (if provided) |
| **Previous order has no CYO bowls** | Overall order rating only (1-5 stars + comments) | Rate overall OR skip | Order ID, overall rating, comments |
| **No previous order** | Skip rating flow entirely | Continue to welcome | No rating data |

### Rating UI/UX Flow Detail

| User Scenario | Interface Display | Possible Actions | Data Saved | Business Value |
|---------------|-------------------|------------------|------------|----------------|
| **Order with CYO bowls** | Two separate rating sections:<br/>1. Overall order rating (stars + comments)<br/>2. Individual CYO bowl rating (thumbs for each bowl) | - Rate overall only<br/>- Rate bowls only<br/>- Rate both<br/>- Skip everything | Partial data based on user choice | Granular feedback for different aspects |
| **Order without CYO bowls** | Single overall rating section only | - Rate overall<br/>- Skip rating | Overall rating data or none | Standard order satisfaction tracking |
| **User rates CYO bowls but skips overall** | Bowls show thumbs up/down selection | Individual bowl feedback only | CYO bowl preferences without overall score | Chef insights without delivery/service bias |
| **User rates overall but skips CYO bowls** | Star rating and comment box | Overall satisfaction only | Service/delivery feedback without bowl specifics | Operational insights without recipe feedback |

### Data Analytics Benefits

- **Separated Feedback Streams**: Bowl quality vs. service quality tracked independently
- **Partial Engagement**: Users who don't want to rate everything can still provide valuable feedback
- **Reduced Rating Fatigue**: Optional rating reduces user burden while maintaining data collection
- **Targeted Improvements**: Teams can focus on specific areas (chef recipes vs. operations) based on available data

---

### Path A: Signature Bowls/Wraps

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **Browse Signatures** | Scroll through options | Load signature items from database | Ingredient availability check | Show unavailable with substitutes |
| **Select Item** | Choose signature bowl/wrap | Load item details | Category validation (SS: cat 1&2, HB: cat 2) | Default to popular item |
| **View Details** | Click for nutrition/sourcing info | Display item information | Brand-specific data rules | Basic info if data missing |

### Path B: Recent Orders

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **View History** | Browse recent orders | Query most recent 5 completed orders | Status = 130, ordered by created_at DESC, limit 5 | Redirect to other paths if empty |
| **Select Order** | Choose order to repeat | Load order details | Validate items still available | Suggest substitutes for unavailable |
| **Confirm Reorder** | Confirm or modify | Recreate order in current session | Location/time compatibility | Update with current location/time |

### Path C: Create Your Own (CYO) with Integrated ML

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **Dietary Filters** | Select allergens, diet preferences | Filter ingredient database | Apply exclusion rules | Show all if filter fails |
| **ML Recommendations** | N/A (automatic) | Call SageMaker ML engine for personalized bowl suggestions | User preferences, dietary filters, location context | 3-second timeout to manual building |
| **Choose Starting Point** | Select ML suggestion OR build manually | Present 5 ML suggestions as starting points | ML recommendations with ingredient availability | Default to manual if ML unavailable |
| **Start with ML Suggestion** | Choose recommended bowl configuration | Load ML-suggested bowl as starting point | Pre-configured bowl with customization options | Allow full customization of suggested bowl |
| **Manual Building** | Start from scratch or if ML unavailable | Present ingredient categories for building | Website API popular ingredients as defaults | Standard manual building process |
| **Bowl Building** | Add/remove ingredients per category | Update bowl composition & weight | Real-time weight tracking (900g max) | Warning at 720g threshold |
| **Composition Rules** | Follow category limits | Enforce business rules | Category-specific validation | Clear limit messaging |

### Path D: Favorites

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **Check Favorites** | N/A | Query user's favorite items from website system | Access customer_customerfavoritemenu table | Redirect to other paths if no favorites |
| **Browse Favorites** | Scroll through saved favorites | Display user's favorited items | Validate items still available | Show unavailable with substitutes |
| **Select Favorite** | Choose favorite item | Load item details for reorder | Same validation as recent orders | Standard ingredient availability flow |

## Customization & Cart Management

### Bowl Customization Flow

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **Edit Ingredients** | Add/remove/modify ingredients | Update composition in real-time | Weight warnings & business rule notifications | Visual weight indicator + chat warnings only |
| **Price Calculation** | N/A (automatic) | Calculate pricing best-effort | Current pricing with change warnings | Notify of potential price changes |
| **Nutrition Display** | View nutrition information | Calculate nutritional values | Ingredient-based calculations | Show available data only |
| **Finalize Bowl** | Confirm customization | Show warning notifications in chat | Weight warnings and rule notifications only | Allow user to proceed despite warnings |

### Add-ons & Cart

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **Add-ons Selection** | Choose optional add-ons | Present available add-ons | 1 add-on per order item limit | Clear selection limit messaging |
| **Add to Cart** | Confirm item addition | Store in device-specific cart | Session cart management | Cart recovery on page refresh |
| **Continue Shopping** | Add more items OR proceed | Return to welcome OR show upselling | Cart state preservation | Maintain cart across flows |

### Checkout Process

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **Review Cart** | Verify items and total | Calculate final pricing | Best-effort price accuracy | Warning about potential changes |
| **Upselling** | Accept/decline additional items | Show order-level suggestions | Website API popular items + rule-based suggestions | Skip if suggestions fail |
| **Final Checkout** | Proceed to payment platform | Hand off to platform system | **PENDING: API format needed** | Manual escalation for failures |

## Error Handling & Recovery

### Authentication Errors

| Error Type | User Experience | System Action | Recovery Path |
|------------|-----------------|---------------|---------------|
| **Invalid Token** | Redirect to login with message | Clear session, redirect | Re-authenticate and return |
| **OTP Failures** | Clear error messaging | Progressive lockout | Wait for lockout period |
| **Session Timeout** | Timeout warning, data preservation | Save cart state | Login and restore cart |

### Ordering Errors

| Error Type | User Experience | System Action | Recovery Path |
|------------|-----------------|---------------|---------------|
| **Ingredient Unavailable** | Clear substitution suggestions | Update availability cache | Alternative ingredient selection |
| **Weight Limit Exceeded** | Visual warning with optimization tips | Prevent cart addition | Remove/substitute ingredients |
| **ML Timeout** | Seamless fallback experience | Switch to cached recommendations | Continue with fallback options |
| **API Rate Limiting** | "Service temporarily busy" message | Pass-through error with retry | Manual retry or alternative path |

### Data Recovery

| Scenario | User Impact | System Response | Prevention |
|----------|-------------|-----------------|------------|
| **Cart Loss** | Minimal - device-specific sessions | 24-hour cart persistence | Local storage backup |
| **Price Changes** | Clear notification | Best-effort pricing with warnings | Regular price cache updates |
| **Session Recovery** | Seamless experience | Device-based session restoration | Session token backup |

## FAQ System Actions

| Step | User Action | System Action | Data/Validation | Error Handling |
|------|-------------|---------------|-----------------|----------------|
| **Ask Question** | Type natural language query | Process with Amazon Bedrock | Semantic search + keyword fallback | Generic helpful response |
| **Receive Answer** | Review response | Generate from knowledge base | OpenSearch embedding retrieval | Manual escalation option |
| **Continue/End** | Choose to order or end session | Return to ordering flow OR cleanup | Session state preservation | Save FAQ interaction data |

## Session Management & Cleanup

| Event | User Impact | System Action | Data Retention |
|-------|-------------|---------------|----------------|
| **Session Start** | Transparent experience | Create device-specific session | 24-hour automatic cleanup |
| **Session Timeout** | Warning with data preservation | Save critical data | Cart preservation priority |
| **Order Completion** | Confirmation and cleanup | Archive session data | Rating prompt preparation |
| **Session End** | Clean exit | Cleanup temporary data | Preserve order history only |

---

**Key Implementation Notes:**

- All pricing calculations are "best-effort" with user notification of potential changes
- Weight warnings trigger at 720g (80% of 900g maximum)
- Device-specific sessions prevent cross-device conflicts  
- 24-hour automatic data cleanup for privacy compliance
- Manual escalation paths for complex error scenarios
- **Order handoff API format still pending from customer**
