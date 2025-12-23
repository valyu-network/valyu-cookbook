## Create a Research Task and Wait for Completion

First step, create a research task

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

// Create a research task
const task = await valyu.deepresearch.create({
  input: "What are the key differences between RAG and fine-tuning for LLMs?",
  model: "lite"
});

console.log(`Task created: ${task.deepresearch_id}`);
console.log(`Status: ${task.status}`);
```

Second step, wait for completion of the task

```ts
// Wait for the task to complete
const result = await valyu.deepresearch.wait(task.deepresearch_id, {
  pollInterval: 5000,    // Check every 5 seconds
  maxWaitTime: 1800000   // Timeout after 30 minutes (lite mode)
});

if (result.status === "completed") {
  console.log("Research completed!");
  console.log(result.output);
  
  // Access sources used
  result.sources?.forEach(source => {
    console.log(`- ${source.title}: ${source.url}`);
  });
  
  // Check costs
  console.log(`Total cost: $${result.usage?.total_cost.toFixed(4)}`);
}
```

```python
# Wait for the task to complete
result = valyu.deepresearch.wait(
    task.deepresearch_id,
    poll_interval=5,      # Check every 5 seconds
    max_wait_time=1800    # Timeout after 30 minutes (lite mode)
)

if result.status == "completed":
    print("Research completed!")
    print(result.output)
    
    # Access sources used
    for source in result.sources:
        print(f"- {source.title}: {source.url}")
    
    # Check costs
    print(f"Total cost: ${result.usage.total_cost:.4f}")
```