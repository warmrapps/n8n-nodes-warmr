# n8n-nodes-warmr

[![npm version](https://badge.fury.io/js/n8n-nodes-warmr.svg)](https://badge.fury.io/js/n8n-nodes-warmr)

A community node for [n8n](https://n8n.io) to integrate with the Warmr API.

## Features

- Get contacts with filters
- Create new contacts (LinkedIn URL required)
- Edit contacts (by LinkedIn URL, email, or UUID)
- Delete contacts (by LinkedIn URL, email, or UUID)

## Installation

### Using n8n Desktop or Self-Hosted

1. Go to **Settings > Community Nodes** in your n8n instance.
2. Click **Install Community Node**.
3. Search for `n8n-nodes-warmr` or enter:
   ```sh
   npm install n8n-nodes-warmr
   ```
4. Restart n8n if required.

### Using npm

```sh
npm install n8n-nodes-warmr
```

## Usage

- Add the "Warmr Contacts" node to your workflow.
- When prompted, create or select your Warmr API credentials (API key).
- Configure the operation and parameters as needed.
- Run your workflow!

## Credentials

- Enter your Warmr API Key (Bearer token) in the credentials UI when prompted.

## Development

- Clone this repo and run `pnpm install` and `pnpm run build`.
- Copy or symlink the build output to your n8n custom nodes directory for local testing.

## Contributing

Pull requests and issues are welcome! Please open an issue for bugs or feature requests.

## License

MIT

## Support

For help, open an issue on [GitHub](https://github.com/yourusername/n8n-nodes-warmr) or ask in the [n8n Community Forum](https://community.n8n.io/).
