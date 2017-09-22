const path = require(`path`);

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  return new Promise((resolve, reject) => {
    graphql(`
      query {
        posts: allContentfulPost {
          edges {
            node {
              slug
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors);
      }
      result.data.posts.edges.map(({ node }) => {
        if (node.slug) {
          createPage({
            path: `blog/${node.slug}`,
            component: path.resolve(`./src/templates/post.js`),
            context: {
              slug: node.slug
            }
          });
        }
      });
      resolve();
    });
  });
};

// gatsby-source-medium

const axios = require(`axios`);
const crypto = require(`crypto`);

const fetch = username => {
  const url = `https://medium.com/balancemymoney/latest?format=json`;
  return axios.get(url);
};

const prefix = `])}while(1);</x>`;

const serialiseBigInt = (nextObj, prevObj, prevKey) => {
  if (typeof nextObj === 'object') {
    Object.keys(nextObj).map(key => serialiseBigInt(nextObj[key], nextObj, key));
  } else {
    if (typeof nextObj === 'number' && nextObj >> 0 !== nextObj) {
      prevObj[prevKey] = String(nextObj);
    }
  }
};

const strip = payload => payload.replace(prefix, ``);

exports.sourceNodes = async ({ boundActionCreators }) => {
  const { createNode } = boundActionCreators;

  try {
    const result = await fetch();
    const json = JSON.parse(strip(result.data));

    const { posts } = json.payload;
    const collectionKeys = Object.keys(json.payload.references.Collection);
    const userKeys = Object.keys(json.payload.references.User);

    const importableResources = [
      userKeys.map(key => json.payload.references.User[key]),
      posts,
      collectionKeys.map(key => json.payload.references.Collection[key])
    ];

    const resources = Array.prototype.concat(...importableResources);
    resources.map(resource => {
      serialiseBigInt(resource);

      const digest = crypto
        .createHash(`md5`)
        .update(JSON.stringify(resource))
        .digest(`hex`);

      const links =
        resource.type === `Post`
          ? {
              author___NODE: resource.creatorId
            }
          : resource.type === `User`
            ? {
                posts___NODE: posts.filter(post => post.creatorId === resource.userId).map(post => post.id)
              }
            : {};

      const node = Object.assign(
        resource,
        {
          id: resource.id ? resource.id : resource.userId,
          parent: `__SOURCE__`,
          children: [],
          internal: {
            type: `Medium${resource.type}`,
            contentDigest: digest
          }
        },
        links
      );

      createNode(node);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
