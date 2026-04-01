#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const command = process.argv[2];
const skillName = process.argv[3];

const CLAUDE_SKILLS_DIR = path.join(process.env.HOME, '.claude', 'skills');

function installSkill(skillName) {
  if (!skillName) {
    console.error('错误：请指定要安装的 skill 名称');
    console.log('用法：npx @dontbesilent/claude-skills install <skill-name>');
    process.exit(1);
  }

  const sourceDir = path.join(__dirname, 'skills', skillName);

  if (!fs.existsSync(sourceDir)) {
    console.error(`错误：skill "${skillName}" 不存在`);
    console.log('\n可用的 skills:');
    const skills = fs.readdirSync(path.join(__dirname, 'skills'));
    skills.forEach(skill => console.log(`  - ${skill}`));
    process.exit(1);
  }

  const targetDir = path.join(CLAUDE_SKILLS_DIR, skillName);

  if (!fs.existsSync(CLAUDE_SKILLS_DIR)) {
    fs.mkdirSync(CLAUDE_SKILLS_DIR, { recursive: true });
  }

  if (fs.existsSync(targetDir)) {
    console.log(`⚠️  skill "${skillName}" 已存在，正在覆盖...`);
    fs.rmSync(targetDir, { recursive: true });
  }

  fs.cpSync(sourceDir, targetDir, { recursive: true });
  console.log(`✅ skill "${skillName}" 安装成功！`);
  console.log(`📁 安装位置：${targetDir}`);
  console.log(`\n使用方式：在 Claude Code 中输入 /${skillName}`);
}

function listSkills() {
  const skillsDir = path.join(__dirname, 'skills');
  const skills = fs.readdirSync(skillsDir);

  console.log('可用的 skills:\n');
  skills.forEach(skill => {
    const skillPath = path.join(skillsDir, skill, 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      const content = fs.readFileSync(skillPath, 'utf-8');
      const descMatch = content.match(/description:\s*\|?\s*\n?\s*(.+)/);
      const desc = descMatch ? descMatch[1].trim() : '无描述';
      console.log(`  ${skill}`);
      console.log(`    ${desc}\n`);
    }
  });
}

switch (command) {
  case 'install':
    installSkill(skillName);
    break;
  case 'list':
    listSkills();
    break;
  default:
    console.log('Claude Skills by dontbesilent\n');
    console.log('用法：');
    console.log('  npx @dontbesilent/claude-skills install <skill-name>');
    console.log('  npx @dontbesilent/claude-skills list');
    console.log('\n示例：');
    console.log('  npx @dontbesilent/claude-skills install lacan');
}
