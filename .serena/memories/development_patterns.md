# Development Methodology (CRITICAL)

## Pattern Analysis Rule
🔍 **ALWAYS ANALYZE EXISTING IMPLEMENTATIONS FIRST**

### BEFORE creating any new module or feature:

1. **🔍 Find Similar Working Code**:
   - Search for similar functionality in existing modules
   - Check `companies/`, `employees/`, `roles-management/`, `audit/` modules
   - Look for patterns in GraphQL queries, mutations, and components

2. **📋 Analyze & Document Patterns**:
   - Identify working GraphQL schemas and queries
   - Note successful API integration patterns
   - Document filtering, sorting, and pagination approaches

3. **🔄 Replicate Working Methodology**:
   - Copy the exact query structure that works
   - Replicate successful mutation patterns
   - Use the same data hooks and state management approach
   - Follow identical error handling patterns

### Examples of Success
- **Employees Module**: Initially failed with custom schemas
- **Solution**: Analyzed `companies/members` working queries
- **Result**: Used exact `membersPaginated` pattern → Success
- **Key**: `LIST_EMPLOYEES` replicated `LIST_COMPANY_OWNERS` structure

### Anti-Patterns to Avoid
❌ **DO NOT**:
- Create new GraphQL schemas without checking existing ones
- Invent new API patterns when working ones exist
- Skip analysis of similar working modules
- Start from scratch when patterns exist

✅ **ALWAYS DO**:
- Find the closest working implementation first
- Test GraphQL queries in Postman if available
- Replicate working patterns exactly
- Adapt incrementally from working base