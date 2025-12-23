## Tool call mode

Valyu is optimised for AI agents by default. 

However, you can use the `tool_call_mode` parameter controls like this:

### For Human Facing Searches

```typescript
// Better for human readability
const response = await valyu.search(
  "quantum computing error correction methods",
  {
    toolCallMode: false,
  }
);
```

```python
# Better for human readability
response = valyu.search(
    "quantum computing error correction methods",
    tool_call_mode=False,
)
```

### For AI Agents

```typescript
// Optimised for LLMs
const response = await valyu.search(
  "quantum error correction surface codes LDPC performance benchmarks",
  {
    toolCallMode: true, // Default
  }
);
```

```python
# Optimised for LLMs
response = valyu.search(
    "quantum error correction surface codes LDPC performance benchmarks",
    tool_call_mode=True,  # Default
)
```