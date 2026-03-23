# Toast Message

Temporary notification bar for success, warning, or error feedback.

## When to Use
- Action confirmation (saved, deleted, sent)
- Error or warning alerts
- System status notifications

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Status | Neutral, Success, Warning, Error | Success |

## Do not use when
- User must explicitly acknowledge the message — use **Modal**
- Message is anchored to a specific element — use **Popover**
- Multiple persistent status messages — use inline validation or **Banner**

## Notes
- Toast messages auto-dismiss after a timeout
- Use Neutral for informational messages