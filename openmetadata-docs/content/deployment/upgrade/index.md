---
title: Upgrade OpenMetadata
slug: /deployment/upgrade
---

# Upgrade OpenMetadata

## Releases

OpenMetadata community will be doing feature releases and stable releases. 
 - Feature releases are to upgrade your sandbox or POCs to give feedback to the community and any potential bugs that the community needs to fix.
 - Stable releases are to upgrade your production environments and share it with your users.

## 0.12.1 - Stable release
 
 OpenMetadata 0.12.1 is a stable release. For Release notes please check here 
 Join our slack https://slack.open-metadata.org provide your feedback and help community to get to the stable 0.12.1 release
 
## Breaking Changes from 0.12.1 Release

OpenMetadata Release 0.12.1 introduces below breaking changes -

### Change of OpenMetadata Service Namespace

Under the [openmetadata.yaml](https://github.com/open-metadata/OpenMetadata/blob/main/conf/openmetadata.yaml), all the class names are updated from `org.openmetadata.catalog.*` to `org.openmetadata.service.*`.

- If you are using a previous version of openmetadata.yaml config file with [bare metal](/deployment/bare-metal) installation, make sure to migrate all these values as per new openmetadata.yaml configurations. Check the below example code snippet from openmetadata.yaml configuration

```yaml
...
authorizerConfiguration:
  className: ${AUTHORIZER_CLASS_NAME:-org.openmetadata.service.security.DefaultAuthorizer}
  containerRequestFilter: ${AUTHORIZER_REQUEST_FILTER:-org.openmetadata.service.security.JwtFilter}
...
```

- If you are using [docker](/deployment/docker) installation with your custom env file, update all the environement variables from `org.openmetadata.catalog.*` to `org.openmetadata.service.*`.

```
AUTHORIZER_CLASS_NAME=org.openmetadata.service.security.DefaultAuthorizer
AUTHORIZER_REQUEST_FILTER=org.openmetadata.service.security.JwtFilter
```

- If you are running openmetadata on [kubernetes with helm charts](/deployment/kubernetes), make sure to update `global.authorizer.className` and `global.authorizer.containerRequestFilter` with below values for your custom openmetadata helm chart values file.

```yaml
global:
  ...
  authorizer:
    className: "org.openmetadata.service.security.DefaultAuthorizer"
    containerRequestFilter: "org.openmetadata.service.security.JwtFilter"
  ...
```

### Centralising of openmetadata/ingestion and openmetadata/airflow docker images

Starting 0.12.1 Release, we have centralized openmetadata/airflow and openmetadata/ingestion docker images 
with openmetadata/ingestion docker image which will be used with docker compose installation and kubernetes helm chart installation. This docker image is based on apache-airflow 2.3.3 image with python 3.9.9. This will be a rootless docker image for enhanced security.

- There is no change or effect with docker installation

- This is a breaking change if you are using a custom openmetadata-dependencies kubernetes helm chart values file.
You will need to manually update the airflow image and tag with openmetadata/ingestion:0.12.1

```yaml
...
airflow:
  airflow:
    image:
      repository: openmetadata/ingestion
      tag: 0.12.1
      pullPolicy: "IfNotPresent"
  ...
```

<p>
If you are extending openmetadata/airflow docker image with 0.12.0 release, you can safely replace that with openmetadata/ingestion:0.12.1 Docker Image.
</p>

```Dockerfile
FROM openmetadata/ingestion:0.12.1
USER airflow
...
```

### Basic Authentication enabled by default

We have deprecated and removed no-auth as the authentication mechanism starting 0.12.1 Release with OpenMetadata.

The default Authentication mechanism will be basic authentication. You can login to OpenMetadata UI with below default credentials -

```
Username - admin
Password - admin
```

### Enabled JWT Token Configuration by default

Starting 0.12.1 Release, OpenMetadata Installation will provide a default configuration that will enable JWT Token Configuration for the OpenMetadata Instance.

If you want to setup a production Open Metadata instance, it is recommended to follow [enable jwt tokens](/deployment/security/enable-jwt-tokens) to setup and configure your own JWT Token configurations.

## Backup Metadata

Before upgrading your OpenMetadata version we recommend backing up the metadata.

The source of truth is stored in the underlying database (MySQL and Postgres supported). You can refer
to the following guide for our backup utility:

<InlineCalloutContainer>
  <InlineCallout
    color="violet-70"
    icon="luggage"
    bold="Backup Metadata"
    href="/deployment/backup-restore-metadata"
  >
    Learn how to back up MySQL data.
  </InlineCallout>
</InlineCalloutContainer>

## Upgrade your installation

Once your metadata is safe, follow the required upgrade instructions:

<InlineCalloutContainer>
  <InlineCallout
    color="violet-70"
    icon="fit_screen"
    bold="Upgrade a Kubernetes Deployment"
    href="/deployment/upgrade/kubernetes"
  >
    Upgrade your Kubernetes installation
  </InlineCallout>

  <InlineCallout
    color="violet-70"
    icon="celebration"
    bold="Upgrade a Docker Deployment"
    href="/deployment/upgrade/docker"
  >
    Upgrade your Docker installation
  </InlineCallout>
  <InlineCallout
    color="violet-70"
    icon="storage"
    bold="Upgrade a Bare Metal Deployment"
    href="/deployment/upgrade/bare-metal"
  >
    Upgrade your Bare Metal installation
  </InlineCallout>
</InlineCalloutContainer>

