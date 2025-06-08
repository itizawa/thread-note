# Workflows for Orchestrator

## Workflow Selection Criteria

**Use "Add new feature" when:**

- User requests adding new functionality
- New files need to be created under `src/`
- Existing functionality needs extension

**Use "Single File Refactoring" when:**

- User requests improving code quality of specific file
- Lint errors exist in a single file
- Code structure needs improvement without API changes

**Use "Library API Refactoring" when:**

- User requests library interface improvements
- Breaking changes to public API are acceptable
- Module exports need restructuring
- Documentation indicates API design issues

---

## Workflow: Add new feature

**Prerequisites:** User has specified the feature requirements and target functionality

### Step 0: Initial Git Status Check

**[Mode: code]**

- Run `git status` to check current repository state
- Ensure working directory is clean or document existing changes
- **Success criteria:** Git status documented and ready for workflow

### Step 1: Analyze existing codebase

**[Mode: ask]**

- Search for similar functionality in `src/` directory using semantic search
- Identify patterns and conventions from existing code
- **Decision criteria:** If similar functionality exists, extend existing file; if not, create new file
- **On failure:** Ask user for clarification on feature requirements
- **Success criteria:** Clear understanding of implementation approach and file location

### Step 2: Create or modify implementation file

**[Mode: code]**

- Create new file `src/{feature-name}.ts` or modify existing file
- Implement feature following functional domain modeling principles
- Use `neverthrow` Result types for error handling
- **Prerequisites:** Step 1 completed successfully
- **On failure:** Switch to [Mode: debug] to analyze compilation errors
- **Success criteria:** File compiles without TypeScript errors

### Step 3: Create comprehensive test file

**[Mode: code]**

- Create `src/{feature-name}.test.ts` with unit tests
- Cover all code paths and edge cases
- Follow TDD principles with descriptive test names
- **Prerequisites:** Implementation file exists and compiles
- **On failure:** Switch to [Mode: debug] to fix test setup issues
- **Success criteria:** All tests pass with `deno task test`

### Step 4: Lint validation

**[Mode: code]**

- Run `deno task check:lint src/{feature-name}.ts`
- **Decision criteria:** If lint errors exist, fix them; if none, proceed
- **On failure:** Fix lint errors or switch to [Mode: refactor] for complex issues
- **Success criteria:** Zero lint errors reported

### Step 5: Integration testing

**[Mode: code]**

- Run `deno task test` to ensure no regressions
- **Decision criteria:** If tests fail, determine if issue is in new code or existing code
- **On failure:** Switch to [Mode: debug] to identify and fix failing tests
- **Success criteria:** All tests pass including existing test suite

### Step 6: Final Git Commit

**[Mode: code]**

- Stage changes with `git add .`
- Commit with conventional commit message format:
  - `feat: add {feature-name}` for new features
  - `feat: extend {existing-feature}` for feature extensions
- **Prerequisites:** All tests pass and lint checks succeed
- **Success criteria:** Changes committed with appropriate conventional commit message

### Step 7: Transition to refactoring

**[Mode: orchestrator]**

- Delegate to "Single File Refactoring" workflow for code quality improvements
- **Prerequisites:** Changes committed successfully
- **Success criteria:** Workflow transition completed

---

## Workflow: Single File Refactoring

**Prerequisites:** Target file path specified and file exists

### Step 0: Initial Git Status Check

**[Mode: code]**

- Run `git status` to check current repository state
- Ensure working directory is clean or document existing changes
- **Success criteria:** Git status documented and ready for workflow

### Step 1: File analysis

**[Mode: ask]**

- Read target file: `src/{filename}.ts`
- Analyze code structure, complexity, and adherence to coding rules
- **On failure:** Request valid file path from user
- **Success criteria:** File content loaded and analyzed

### Step 2: Initial lint check

**[Mode: code]**

- Run `deno task check:lint src/{filename}.ts`
- Document all lint errors and warnings
- **Prerequisites:** File exists and is readable
- **On failure:** Switch to [Mode: debug] to resolve lint tool issues
- **Success criteria:** Lint results captured (may include errors to fix)

### Step 3: Refactoring plan creation

**[Mode: refactor]**

- Identify specific refactoring opportunities:
  - Function extraction for complex logic
  - Type safety improvements
  - Adherence to functional programming principles
  - Error handling with `neverthrow`
- **Prerequisites:** Lint analysis completed
- **On failure:** Request additional context about refactoring goals
- **Success criteria:** Concrete refactoring plan with specific changes identified

### Step 4: Apply refactoring changes

**[Mode: refactor]**

- Implement planned refactoring changes
- Maintain existing functionality (no behavioral changes)
- Ensure all functions return `Result<T, E>` types where appropriate
- **Prerequisites:** Refactoring plan exists
- **On failure:** Revert changes and switch to [Mode: debug] to analyze issues
- **Success criteria:** File compiles without TypeScript errors

### Step 5: Post-refactoring lint validation

**[Mode: code]**

- Run `deno task check:lint src/{filename}.ts`
- **Decision criteria:** If lint errors remain, repeat Step 4; if clean, proceed
- **On failure:** Switch to [Mode: debug] to resolve persistent lint issues
- **Success criteria:** Zero lint errors reported

### Step 6: Test validation

**[Mode: code]**

- Run tests for the specific file: `deno task test src/{filename}.test.ts`
- **Decision criteria:** If tests fail, analyze if due to refactoring or test issues
- **Prerequisites:** Lint validation passed
- **On failure:** Switch to [Mode: debug] to fix test failures
- **Success criteria:** All file-specific tests pass

### Step 7: Full test suite validation

**[Mode: code]**

- Run `deno task test` to ensure no regressions
- **Prerequisites:** File-specific tests pass
- **On failure:** Switch to [Mode: debug] to identify and fix regressions
- **Success criteria:** All tests in project pass

### Step 8: Final Git Commit

**[Mode: code]**

- Stage changes with `git add .`
- Commit with conventional commit message format:
  - `refactor: improve {filename}` for code quality improvements
  - `fix: resolve lint issues in {filename}` for lint fixes
  - `style: format {filename}` for formatting changes
