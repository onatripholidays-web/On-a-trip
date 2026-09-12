# CRM build-safe typography

The CRM layout uses a local/system font stack rather than `next/font/google`, so production builds do not depend on downloading Google Fonts during the build. Inter is used when available, with Segoe UI/system fallbacks.