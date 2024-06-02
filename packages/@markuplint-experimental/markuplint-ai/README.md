# The `markuplint-ai` plugin

The markup evaluation rules that use LLM (Large Language Model) AI.

## Install

```shell
yarn add -D @markuplint-experimental/markuplint-ai
```

## Rules

### `rule-semantic`

Rule that checks the semantic correctness of the markup using LLM

```json
{
  "plugins": ["@markuplint-experimental/markuplint-ai"],
  "rules": {
    "markuplint-ai/rule-semantic": {
      "options": {
        "OPENAI_API_KEY": "YOUR_API_KEY",
        "model": "gpt-4-turbo"
      }
    }
  }
}
```

Use `.env` or environment variables to set `OPENAI_API_KEY`.

#### Interface

- Type: `boolean`
- Default Value: `true`

#### Options

Open AI settings.

##### Interface

| Property         | Type     | Optional | Default Value                | Description                                                                 |
| ---------------- | -------- | -------- | ---------------------------- | --------------------------------------------------------------------------- |
| `OPENAI_API_KEY` | `string` | ✔       | `process.env.OPENAI_API_KEY` | :warning: **DO NOT USE this property** instead of the environment variable. |
| `model`          | `string` | ✔       | `"gpt-4-turbo"`              | See https://platform.openai.com/docs/models                                 |
