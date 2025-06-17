# AI Coding Practice - Claude Configuration

## Project Overview

This is a learning and practice repository focused on AI-assisted coding tools, specifically Claude Code and Model Context Protocol (MCP). The project serves as a hands-on exploration of modern AI development tools and techniques.

### Project Type and Tech Stack

- **Primary Purpose**: Educational repository for AI coding practice
- **Main Technologies**: PHP (sample code), Documentation (Markdown)
- **AI Tools**: Claude Code, MCP exploration
- **Version Control**: Git (currently on branch `init/claude-code`)
- **Environment**: macOS-focused development setup

## Directory Structure

```
/Users/endofutoshi/src/github.com/Fendo181/ai_coding_practice/
├── README.md                    # Main project documentation
├── .gitignore                   # Git ignore rules (macOS-specific)
├── claude-code/                 # Claude Code learning materials
│   ├── README.md               # Comprehensive Claude Code setup guide
│   ├── img/                    # Documentation screenshots
│   │   ├── image1.png          # Setup screenshots
│   │   ├── image2.png
│   │   ├── image3.png
│   │   └── image4.png
│   └── sample/                 # Code examples
│       └── hello.php           # FizzBuzz implementation (refactored)
└── mcp/                        # Model Context Protocol materials
    ├── README.md               # MCP learning documentation
    ├── LICENSE                 # License file
    └── code/                   # MCP code examples
        └── README.md           # VS Code related notes
```

## Key Components

### Claude Code Materials (`/claude-code/`)
- **Setup Guide**: Comprehensive documentation for Claude Code installation and configuration
- **Sample Code**: PHP FizzBuzz implementation demonstrating refactoring capabilities
- **Mode Documentation**: Covers different Claude Code modes (auto-accept, plan mode)
- **Screenshots**: Visual setup guides for the installation process

### MCP Materials (`/mcp/`)
- **Learning Resources**: Documentation about Model Context Protocol
- **Code Examples**: Practical implementations and explorations
- **VS Code Integration**: Notes on IDE integration

## Development Environment

### System Requirements
- **OS**: macOS Sonoma 14.5 (as documented)
- **Node.js**: v22.2.0
- **npm**: 10.7.0
- **Claude Code**: v1.0.25

### Setup Commands

```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Launch Claude Code
claude

# Check version
claude-code --version
```

## Available Commands

### Git Operations
```bash
# Current branch status
git status

# View commit history
git log --oneline

# Branch management
git branch -a
```

### PHP Development
```bash
# Run PHP sample code
php claude-code/sample/hello.php
```

## Claude Code Modes

### 1. Standard Mode
- Default interactive mode
- Manual approval required for changes
- Suitable for careful code review

### 2. Auto-Accept Mode (`shift + tab` once)
- Automatically accepts code changes
- Enables file creation and modification
- Use with caution for trusted operations

### 3. Plan Mode (`shift + tab` twice)
- Shows detailed execution plan before changes
- Provides structured approach to modifications
- Recommended for complex refactoring tasks

## Architecture and Patterns

### Learning-Focused Structure
- **Documentation-First**: Extensive README files with step-by-step guides
- **Visual Learning**: Screenshots and images for setup processes
- **Practical Examples**: Real code samples demonstrating concepts
- **Incremental Learning**: Separate directories for different AI tools

### Code Quality Practices
- **Refactoring Examples**: Shows evolution from basic to improved code
- **Constant Usage**: Demonstrates modern PHP practices
- **Switch Statement Implementation**: Shows alternative control structures
- **Function Decomposition**: Clear separation of concerns

## Development Guidelines

### Code Style
- Use meaningful constant names (FIZZ_DIVISOR, BUZZ_DIVISOR)
- Implement proper error handling
- Follow consistent indentation and formatting
- Add descriptive comments for complex logic

### Documentation Standards
- Include setup instructions with system requirements
- Provide visual guides with screenshots
- Document mode changes and their implications
- Maintain bilingual content (Japanese primary, English secondary)

### AI Tool Usage
- Always review AI-generated code before acceptance
- Use plan mode for complex changes
- Leverage constants for maintainable code
- Follow security best practices for AI tools

## Claude Code Memory Configuration

This project supports Claude Code's memory system through the following files:

- **Project Memory**: `./CLAUDE.md` (this file) - Project-specific settings and guidelines
- **User Memory**: `~/.claude/CLAUDE.md` - Personal settings across all projects
- **Local Memory**: `./CLAUDE.local.md` - Individual project preferences (if needed)

## Security Considerations

### AI Tool Safety
- Always review Claude's responses before executing code
- Use only with trusted codebases due to prompt injection risks
- Refer to [Claude Code Security](https://docs.anthropic.com/s/claude-code-security) for detailed guidelines

### Git Practices
- Keep sensitive information out of version control
- Use appropriate .gitignore rules
- Review commits before pushing to remote repositories

## Learning Objectives

### Primary Goals
1. Master Claude Code setup and configuration
2. Understand different AI coding assistance modes
3. Practice refactoring techniques with AI assistance
4. Explore Model Context Protocol concepts
5. Document AI-assisted development workflows

### Skills Development
- AI-assisted coding workflows
- Documentation-driven development
- Visual learning material creation
- Cross-platform development setup
- Modern PHP development practices

## Resources and References

- [Claude Code Official Documentation](https://claude.ai/claude-code)
- [Claude Code Security Guidelines](https://docs.anthropic.com/s/claude-code-security)
- [Claude Code IDE Integrations](https://docs.anthropic.com/s/claude-code-ide-integrations)
- [Model Context Protocol Documentation](https://docs.anthropic.com/en/docs/claude-code/memory)

## Notes for Claude

- This is a learning-focused project with emphasis on documentation and examples
- Prefer educational explanations over production-ready implementations
- Maintain the bilingual documentation style (Japanese primary)
- Consider the macOS development environment when suggesting tools or commands
- Respect the existing directory structure and naming conventions
- Always provide context for changes and learning opportunities
```