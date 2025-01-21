# ABI2UI

This repository contains a Svelte application that automatically builds a UI
to read or write any smart contract.

It leverages the [OKcontract](https://okcontract.com) stack that comprises
multiple open source libraries: [cells](https://github.com/okcontract/cells),
[fred](https://github.com/okcontract/fred),
[multichain](https://github.com/okcontract/multichain) and the OKcontract
[SDK](https://github.com/okcontract/sdk).

This application is built with [Svelte](https://svelte.dev/).

## Getting started

```sh
npm i
npm run build
npm run preview
```

## Changing contract

The contract is identified by its OKcontract identifier: You can find
identifiers with the [OKcontract Hub](https://app.okcontract.com).

Alternatively, you can choose a contract by its address using the identifier
`con:@{chain}/{0x...}` where `chain` is the chain ID on OKcontract (e.g.
`optimism`) and `0x...` the contract address.

## Design & Philosophy

OKcontract provides powerful tools for developers to create and manage smart
contract interactions efficiently.

The idea behind the OKcontract is to operate a permissionless network that
doesn't require an API key, making it much easier for developers to kickstart
smart contract integration into their frontends.

## Documentation

For more details, documentation, and examples visit
[docs.okcontract.com/sdk](https://docs.okcontract.com/sdk).

## License

This app repository is released under the
[GNU Affero GPL](https://www.gnu.org/licenses/agpl-3.0.en.html) license.

Many OKcontract core libraries are released under the MIT or Apache license,
please see there respective repository for licensing details.
