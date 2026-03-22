# growapple

**growapple** is an interactive web application dedicated to preserving and visualizing the complex genetic history of apple cultivars. From ancient chance seedlings to modern bred varieties, this project makes botanical history accessible through a high-performance, data-driven interface.

## Features

* 🍎 **Comprehensive Directory**: Browse a detailed list of apple varieties, filterable by name and origin.
* 🧬 **Interactive Network Graph**: Visualize the genetic connections (parentage and offspring) between varieties using an interactive force-directed graph.
* 📖 **Detailed Profiles**: View information for each apple, including its introduction year and origin.
* 🌙 **Dark-Only UI**: A sleek, focused interface designed exclusively for dark mode.
* 🔍 **SEO Optimized**: Leveraging Nuxt's server-side rendering for improved discoverability.

## Tech Stack

The project utilizes a **BFF (Backend-for-Frontend)** architecture to merge and serve complex botanical data:

* **Framework**: [Nuxt 3](https://nuxt.com/)
* **GraphQL Client**: [Apollo Client (Nuxt Apollo)](https://apollo.nuxtjs.org/)
* **Database**: [Supabase](https://supabase.com/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Data Visualization**: [D3.js](https://d3js.org/)

## 📡 API & Development

> [!IMPORTANT]
> **Local Project Access**: The source code for local development is currently restricted and will be made accessible at a later date.

### Public GraphQL API
You can interact with the live data through our public endpoint:
* **API URL**: `https://growapple.org/api/fruit/gql`
* **Playground**: Explore the schema and test queries via [Apollo Sandbox](https://studio.apollographql.com/sandbox/explorer?endpoint=https://growapple.org/api/fruit/gql)

### Example Query
```graphql
query Fruits {
  fruits {
    pageInfo {
      hasNextPage
      skip
      take
    }
    data {
      id
      slug
      name
      short_description
      children {
        id
        slug
        children {
          slug
        }
      }
      parentage {
        id
        slug
        name
      }
    }
  }
}