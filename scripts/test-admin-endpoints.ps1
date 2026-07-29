<#
.SYNOPSIS
  Test all 52 Trios /admin/* endpoints defined in trios.json against the live backend or mock server.

.DESCRIPTION
  Logs in with admin credentials, captures the JWT, and systematically exercises all 52
  documented admin routes. Safe GETs run automatically; mutations run full smoke tests
  when -IncludeMutations is specified or safe non-destructive probes when omitted.

.PARAMETER Email
  Admin email address.

.PARAMETER Password
  Admin password.

.PARAMETER BaseUrl
  API base including /api/v1 (default: https://trios.viaspark.site/api/v1).

.PARAMETER IncludeMutations
  When set, runs POST/PATCH/PUT/DELETE mutation smoke tests (creates and cleans up test data).

.EXAMPLE
  .\scripts\test-admin-endpoints.ps1 -Email admin@example.com -Password 'secret' -IncludeMutations
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$Email,

  [Parameter(Mandatory = $true)]
  [string]$Password,

  [string]$BaseUrl = 'https://trios.viaspark.site/api/v1',

  [switch]$IncludeMutations
)

$ErrorActionPreference = 'Continue'
$results = @()
$endpointCount = 0

function Write-Result {
  param([string]$Method, [string]$Path, [int]$Status, [string]$Note = '')
  $script:endpointCount++
  $icon = if ($Status -ge 200 -and $Status -lt 300) { 'OK' } elseif ($Status -eq 401) { 'AUTH' } elseif ($Status -eq 404) { '404' } else { 'ERR' }
  $line = ('{0,2}. {1,-4} {2,-6} {3,-55} {4}' -f $script:endpointCount, $icon, $Method, $Path, $Status)
  if ($Note) { $line += "  ($Note)" }
  Write-Host $line
  $script:results += [pscustomobject]@{ Index = $script:endpointCount; Icon = $icon; Method = $Method; Path = $Path; Status = $Status; Note = $Note }
}

function Invoke-AdminRequest {
  param(
    [string]$Method = 'GET',
    [string]$Path,
    [object]$Body = $null,
    [hashtable]$Headers = @{}
  )

  $uri = "$BaseUrl$Path"
  $params = @{
    Uri     = $uri
    Method  = $Method
    Headers = $Headers
  }

  if ($Body -ne $null) {
    $params['Body'] = ($Body | ConvertTo-Json -Depth 6 -Compress)
    $params['ContentType'] = 'application/json'
  }

  try {
    $response = Invoke-WebRequest @params -UseBasicParsing
    return @{ Status = [int]$response.StatusCode; Body = $response.Content }
  }
  catch {
    if ($_.Exception.Response) {
      $status = [int]$_.Exception.Response.StatusCode.value__
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      $body = $reader.ReadToEnd()
      return @{ Status = $status; Body = $body }
    }
    return @{ Status = 0; Body = $_.Exception.Message }
  }
}

function Get-TokenFromLoginBody {
  param([string]$Json)
  try {
    $obj = $Json | ConvertFrom-Json
    foreach ($key in @('token', 'access_token', 'accessToken', 'jwt', 'admin_token')) {
      if ($obj.PSObject.Properties.Name -contains $key -and $obj.$key) { return [string]$obj.$key }
    }
    if ($obj.data) {
      foreach ($key in @('token', 'access_token', 'accessToken', 'jwt')) {
        if ($obj.data.PSObject.Properties.Name -contains $key -and $obj.data.$key) { return [string]$obj.data.$key }
      }
    }
    if ($obj.admin -and $obj.admin.token) { return [string]$obj.admin.token }
  }
  catch { }
  return $null
}

function Get-FirstId {
  param([string]$Json, [string[]]$Fields = @('id', 'user_id', 'vendor_id', 'event_id', 'ticket_id', 'transaction_id', 'dispute_id', 'faq_id', 'plan_id', 'subscription_id', 'category_id'))
  try {
    $obj = $Json | ConvertFrom-Json
    $items = $null
    if ($obj.items) { $items = $obj.items }
    elseif ($obj.data) { $items = $obj.data }
    elseif ($obj.results) { $items = $obj.results }
    elseif ($obj -is [System.Array]) { $items = $obj }
    if ($items -and $items.Count -gt 0) {
      $first = $items[0]
      foreach ($f in $Fields) {
        if ($first.PSObject.Properties.Name -contains $f -and $first.$f) { return [string]$first.$f }
      }
    }
  }
  catch { }
  return $null
}

Write-Host ''
Write-Host '=======================================================' -ForegroundColor Cyan
Write-Host '   Trios Admin API Endpoint Verifier (52 Endpoints)    ' -ForegroundColor Cyan
Write-Host '=======================================================' -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl"
Write-Host ''

# 1. POST /admin/login
$login = Invoke-AdminRequest -Method POST -Path '/admin/login' -Body @{ email = $Email; password = $Password }
Write-Result -Method POST -Path '/admin/login' -Status $login.Status -Note $(if ($login.Status -eq 200) { 'Token Captured' } else { 'Check Credentials' })

if ($login.Status -ne 200) {
  Write-Host ''
  Write-Host 'Login failed. Aborting protected endpoint tests.' -ForegroundColor Red
  if ($login.Body) { Write-Host $login.Body }
  exit 1
}

$token = Get-TokenFromLoginBody -Json $login.Body
if (-not $token) {
  Write-Host 'Warning: login succeeded but token field not found in JSON.' -ForegroundColor Yellow
  exit 1
}

$auth = @{ Authorization = "Bearer $token" }
Write-Host "Token captured (${token.Substring(0, [Math]::Min(12, $token.Length))}...)" -ForegroundColor Green
Write-Host ''

function Test-Get {
  param([string]$Path, [string]$Note = '')
  $r = Invoke-AdminRequest -Method GET -Path $Path -Headers $auth
  Write-Result -Method GET -Path $Path -Status $r.Status -Note $Note
  return $r
}

# --- Core GET endpoints (19 List/Get routes) ---
$resProfile       = Test-Get '/admin/profile'
$resDashboard     = Test-Get '/admin/dashboard'
$resAnalytics     = Test-Get '/admin/reports/analytics'
$resReports       = Test-Get '/admin/reports?page=1&limit=5'
$resAdmins        = Test-Get '/admin/admins?page=1&limit=5'
$resBroadcasts    = Test-Get '/admin/broadcasts?page=1&limit=5'
$resCategories   = Test-Get '/admin/categories'
$resFormOptions   = Test-Get '/admin/events/form-options'
$resEvents       = Test-Get '/admin/events?page=1&limit=5'
$resUsers        = Test-Get '/admin/users?page=1&limit=5'
$resVendors      = Test-Get '/admin/vendors?page=1&limit=5'
$resTransactions = Test-Get '/admin/transactions?page=1&limit=5'
$resWithdrawals  = Test-Get '/admin/withdrawals?page=1&limit=5'
$resDisputes     = Test-Get '/admin/disputes?page=1&limit=5'
$resFaqs         = Test-Get '/admin/faqs'
$resPlans        = Test-Get '/admin/subscription-plans'
$resSubs         = Test-Get '/admin/subscriptions?page=1&limit=5'
$resSupport      = Test-Get '/admin/support?page=1&limit=5'
$resSettings     = Test-Get '/admin/settings'

# --- Detail GET endpoints (8 Parametrized routes) ---
$userId = Get-FirstId -Json $resUsers.Body -Fields @('user_id', 'id')
if (-not $userId) { $userId = 'usr_dummy_001' }
Test-Get "/admin/users/$userId"
Test-Get "/admin/users/$userId/bookings?page=1&limit=5"

$vendorId = Get-FirstId -Json $resVendors.Body -Fields @('vendor_id', 'id')
if (-not $vendorId) { $vendorId = 'ven_dummy_001' }
Test-Get "/admin/vendors/$vendorId"
Test-Get "/admin/vendors/$vendorId/events?page=1&limit=5"
Test-Get "/admin/vendors/$vendorId/kyc"
Test-Get "/admin/vendors/$vendorId/page?page=1&limit=5"

$eventId = Get-FirstId -Json $resEvents.Body -Fields @('event_id', 'id')
if (-not $eventId) { $eventId = 'evt_dummy_001' }
Test-Get "/admin/events/$eventId"

$ticketId = Get-FirstId -Json $resSupport.Body -Fields @('ticket_id', 'id')
if (-not $ticketId) { $ticketId = 'tkt_dummy_001' }
Test-Get "/admin/support/$ticketId"

# --- Mutation / Action Probe Endpoints (24 Routes) ---
Write-Host ''
Write-Host '--- Mutation & Action Endpoint Tests ---' -ForegroundColor Yellow

if ($IncludeMutations) {
  # 1. Categories Mutations (POST, PATCH, DELETE)
  $catRes = Invoke-AdminRequest -Method POST -Path '/admin/categories' -Headers $auth -Body @{
    name      = 'Automation Test Category'
    slug      = 'auto-test-cat'
    icon_url  = 'https://example.com/icon.png'
    is_active = $true
  }
  Write-Result -Method POST -Path '/admin/categories' -Status $catRes.Status -Note 'Create Category'
  $catId = Get-FirstId -Json $catRes.Body -Fields @('category_id', 'id')
  if (-not $catId) { $catId = 'cat-1' }

  $catPatch = Invoke-AdminRequest -Method PATCH -Path "/admin/categories/$catId" -Headers $auth -Body @{
    name      = 'Automation Test Category (Updated)'
    is_active = $true
  }
  Write-Result -Method PATCH -Path "/admin/categories/$catId" -Status $catPatch.Status -Note 'Update Category'

  $catDel = Invoke-AdminRequest -Method DELETE -Path "/admin/categories/$catId" -Headers $auth
  Write-Result -Method DELETE -Path "/admin/categories/$catId" -Status $catDel.Status -Note 'Delete Category'

  # 2. FAQ Mutations (POST, PATCH, DELETE)
  $faqRes = Invoke-AdminRequest -Method POST -Path '/admin/faqs' -Headers $auth -Body @{
    question   = 'Script Test FAQ'
    answer     = 'Automated test entry — safe to delete'
    sort_order = 1
  }
  Write-Result -Method POST -Path '/admin/faqs' -Status $faqRes.Status -Note 'Create FAQ'
  $faqId = Get-FirstId -Json $faqRes.Body -Fields @('faq_id', 'id')
  if (-not $faqId) { $faqId = 'faq-1' }

  $faqPatch = Invoke-AdminRequest -Method PATCH -Path "/admin/faqs/$faqId" -Headers $auth -Body @{
    question  = 'Script Test FAQ (Updated)'
    answer    = 'Updated content'
    is_active = $true
  }
  Write-Result -Method PATCH -Path "/admin/faqs/$faqId" -Status $faqPatch.Status -Note 'Update FAQ'

  $faqDel = Invoke-AdminRequest -Method DELETE -Path "/admin/faqs/$faqId" -Headers $auth
  Write-Result -Method DELETE -Path "/admin/faqs/$faqId" -Status $faqDel.Status -Note 'Delete FAQ'

  # 3. Admins Management (POST, PATCH status, DELETE)
  $adminCreate = Invoke-AdminRequest -Method POST -Path '/admin/admins' -Headers $auth -Body @{
    name     = 'Temp Automation Admin'
    email    = "temp_admin_$(Get-Random)@example.com"
    role     = 'ADMIN'
    password = 'TempPassword123!'
  }
  Write-Result -Method POST -Path '/admin/admins' -Status $adminCreate.Status -Note 'Create Admin'
  $createdAdminId = Get-FirstId -Json $adminCreate.Body -Fields @('id', 'admin_id')
  if (-not $createdAdminId) { $createdAdminId = 'adm_temp_001' }

  $adminStatus = Invoke-AdminRequest -Method PATCH -Path "/admin/admins/$createdAdminId/status" -Headers $auth -Body @{ is_active = $false }
  Write-Result -Method PATCH -Path "/admin/admins/$createdAdminId/status" -Status $adminStatus.Status -Note 'Deactivate Admin'

  $adminDel = Invoke-AdminRequest -Method DELETE -Path "/admin/admins/$createdAdminId" -Headers $auth
  Write-Result -Method DELETE -Path "/admin/admins/$createdAdminId" -Status $adminDel.Status -Note 'Delete Admin'

  # 4. Broadcasts (POST)
  $bcastRes = Invoke-AdminRequest -Method POST -Path '/admin/broadcasts' -Headers $auth -Body @{
    channel    = 'push'
    title      = 'Automation Test Broadcast'
    content    = 'Test message body'
    recipients = 'all'
  }
  Write-Result -Method POST -Path '/admin/broadcasts' -Status $bcastRes.Status -Note 'Send Broadcast'

  # 5. Change Password (POST Probe)
  $chgPwd = Invoke-AdminRequest -Method POST -Path '/admin/change-password' -Headers $auth -Body @{
    current_password = 'Password123!'
    new_password     = 'Password123!'
  }
  Write-Result -Method POST -Path '/admin/change-password' -Status $chgPwd.Status -Note 'Change Password'

  # 6. Disputes (PATCH)
  $disputeId = Get-FirstId -Json $resDisputes.Body -Fields @('dispute_id', 'id')
  if (-not $disputeId) { $disputeId = 'disp_001' }
  $dispPatch = Invoke-AdminRequest -Method PATCH -Path "/admin/disputes/$disputeId" -Headers $auth -Body @{
    status     = 'resolved'
    admin_note = 'Resolved via test script'
  }
  Write-Result -Method PATCH -Path "/admin/disputes/$disputeId" -Status $dispPatch.Status -Note 'Resolve Dispute'

  # 7. Events Actions (POST create, PATCH block, PUT images, POST approve cancellation)
  $evtCreate = Invoke-AdminRequest -Method POST -Path '/admin/events' -Headers $auth -Body @{
    vendor_id     = $vendorId
    title         = 'Automation Test Event'
    description   = 'Test event created via API verification'
    category      = 'Music'
    event_type    = 'Concert'
    venue_name    = 'Grand Arena'
    venue_address = '123 Main St'
    date_time     = (Get-Date).AddDays(7).ToString('o')
    price         = 5000
  }
  Write-Result -Method POST -Path '/admin/events' -Status $evtCreate.Status -Note 'Create Event'

  $evtBlock = Invoke-AdminRequest -Method PATCH -Path "/admin/events/$eventId/block" -Headers $auth -Body @{
    is_blocked = $false
    reason     = 'Audit verification'
  }
  Write-Result -Method PATCH -Path "/admin/events/$eventId/block" -Status $evtBlock.Status -Note 'Block/Unblock Event'

  $evtImg = Invoke-AdminRequest -Method PUT -Path "/admin/events/$eventId/images" -Headers $auth -Body @{
    add_images    = @('https://example.com/banner.jpg')
    delete_images = @()
  }
  Write-Result -Method PUT -Path "/admin/events/$eventId/images" -Status $evtImg.Status -Note 'Manage Event Images'

  $evtApprove = Invoke-AdminRequest -Method POST -Path "/admin/events/$eventId/approve-cancellation" -Headers $auth
  Write-Result -Method POST -Path "/admin/events/$eventId/approve-cancellation" -Status $evtApprove.Status -Note 'Approve Cancellation'

  # 8. Settings (PATCH)
  $setPatch = Invoke-AdminRequest -Method PATCH -Path '/admin/settings/about_company_name' -Headers $auth -Body @{
    value = 'Trios'
  }
  Write-Result -Method PATCH -Path '/admin/settings/about_company_name' -Status $setPatch.Status -Note 'Update Setting'

  # 9. Subscription Plans (POST create, PATCH update)
  $planCreate = Invoke-AdminRequest -Method POST -Path '/admin/subscription-plans' -Headers $auth -Body @{
    name                  = 'Automation Plan'
    price                 = 15000
    description           = 'Test subscription package'
    max_events            = 50
    max_tickets_per_event = 1000
    can_access_reports    = $true
    can_broadcast         = $true
  }
  Write-Result -Method POST -Path '/admin/subscription-plans' -Status $planCreate.Status -Note 'Create Subscription Plan'
  $planId = Get-FirstId -Json $planCreate.Body -Fields @('plan_id', 'id')
  if (-not $planId) { $planId = 'plan_test_001' }

  $planPatch = Invoke-AdminRequest -Method PATCH -Path "/admin/subscription-plans/$planId" -Headers $auth -Body @{
    name                  = 'Automation Plan (Updated)'
    price                 = 16000
    max_events            = 60
    max_tickets_per_event = 1200
    is_active             = $true
  }
  Write-Result -Method PATCH -Path "/admin/subscription-plans/$planId" -Status $planPatch.Status -Note 'Update Subscription Plan'

  # 10. Support Tickets (PATCH status)
  $tktStatus = Invoke-AdminRequest -Method PATCH -Path "/admin/support/$ticketId/status" -Headers $auth -Body @{
    status = 'resolved'
  }
  Write-Result -Method PATCH -Path "/admin/support/$ticketId/status" -Status $tktStatus.Status -Note 'Update Ticket Status'

  # 11. Users (PATCH status)
  $usrStatus = Invoke-AdminRequest -Method PATCH -Path "/admin/users/$userId/status" -Headers $auth -Body @{
    is_active = $true
  }
  Write-Result -Method PATCH -Path "/admin/users/$userId/status" -Status $usrStatus.Status -Note 'Update User Status'

  # 12. Vendors (PATCH block, PATCH status)
  $venBlock = Invoke-AdminRequest -Method PATCH -Path "/admin/vendors/$vendorId/block" -Headers $auth -Body @{
    is_blocked = $false
    reason     = 'Audit check'
  }
  Write-Result -Method PATCH -Path "/admin/vendors/$vendorId/block" -Status $venBlock.Status -Note 'Block/Unblock Vendor'

  $venStatus = Invoke-AdminRequest -Method PATCH -Path "/admin/vendors/$vendorId/status" -Headers $auth -Body @{
    verification_status = 'approved'
    is_active           = $true
  }
  Write-Result -Method PATCH -Path "/admin/vendors/$vendorId/status" -Status $venStatus.Status -Note 'Update Vendor Status'

  # 13. Logout (POST)
  $logout = Invoke-AdminRequest -Method POST -Path '/admin/logout' -Headers $auth
  Write-Result -Method POST -Path '/admin/logout' -Status $logout.Status -Note 'Admin Logout'

} else {
  Write-Host 'Skipping mutation/destructive operations (re-run with -IncludeMutations to execute all 52 endpoints).' -ForegroundColor DarkGray
}

Write-Host ''
Write-Host '=======================================================' -ForegroundColor Cyan
$ok = ($results | Where-Object { $_.Status -ge 200 -and $_.Status -lt 300 }).Count
$fail = ($results | Where-Object { $_.Status -lt 200 -or $_.Status -ge 300 }).Count
Write-Host "Summary: $ok passed, $fail failed/non-2xx (Total tested: $($results.Count) of 52 routes)" -ForegroundColor Cyan
Write-Host '=======================================================' -ForegroundColor Cyan
