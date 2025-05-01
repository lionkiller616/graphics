@echo off
REM Create directory tree
mkdir graphics
mkdir graphics\css
mkdir graphics\css\themes
mkdir graphics\css\pages
mkdir graphics\js
mkdir graphics\js\modules
mkdir graphics\js\modules\api
mkdir graphics\js\features
mkdir graphics\js\features\principles
mkdir graphics\js\features\elements
mkdir graphics\js\features\shapes
mkdir graphics\js\features\colors
mkdir graphics\js\features\animations
mkdir graphics\js\features\branding

REM Create root HTML and README
type nul > graphics\README.md
type nul > graphics\index.html
type nul > graphics\about.html
type nul > graphics\principles.html
type nul > graphics\elements.html
type nul > graphics\colors.html
type nul > graphics\shapes.html
type nul > graphics\animations.html
type nul > graphics\branding.html

REM Create CSS files
type nul > graphics\css\reset.css
type nul > graphics\css\variables.css
type nul > graphics\css\main.css
type nul > graphics\css\utilities.css
type nul > graphics\css\themes\light.css
type nul > graphics\css\themes\dark.css
type nul > graphics\css\pages\home.css
type nul > graphics\css\pages\about.css
type nul > graphics\css\pages\blog.css
type nul > graphics\css\pages\course.css

REM Create JS bootstrap
type nul > graphics\js\main.js

REM Create JS modules
type nul > graphics\js\modules\navigation.js
type nul > graphics\js\modules\darkmode.js
type nul > graphics\js\modules\scrollAnimations.js
type nul > graphics\js\modules\formValidation.js

REM Create JS API files
type nul > graphics\js\modules\api\colors.js
type nul > graphics\js\modules\api\animations.js
type nul > graphics\js\modules\api\shapes.js

REM Create JS feature scripts
type nul > graphics\js\features\principles\balance.js
type nul > graphics\js\features\principles\contrast.js
type nul > graphics\js\features\principles\emphasis.js
type nul > graphics\js\features\principles\hierarchy.js
type nul > graphics\js\features\principles\alignment.js
type nul > graphics\js\features\principles\proximity.js
type nul > graphics\js\features\principles\repetition.js

type nul > graphics\js\features\elements\line.js
type nul > graphics\js\features\elements\shape.js
type nul > graphics\js\features\elements\color.js
type nul > graphics\js\features\elements\texture.js
type nul > graphics\js\features\elements\space.js
type nul > graphics\js\features\elements\typography.js

type nul > graphics\js\features\shapes\meaning.js
type nul > graphics\js\features\shapes\branding.js
type nul > graphics\js\features\shapes\psychology.js

type nul > graphics\js\features\colors\theory.js
type nul > graphics\js\features\colors\psychology.js
type nul > graphics\js\features\colors\palettes.js
type nul > graphics\js\features\colors\tools.js

type nul > graphics\js\features\animations\easing.js
type nul > graphics\js\features\animations\timing.js
type nul > graphics\js\features\animations\motion-graphics.js
type nul > graphics\js\features\animations\microinteractions.js

type nul > graphics\js\features\branding\logo-design.js
type nul > graphics\js\features\branding\typography.js
type nul > graphics\js\features\branding\brand-guidelines.js
type nul > graphics\js\features\branding\visual-identity.js

echo.
echo Project scaffold created under .\graphics\
pause
