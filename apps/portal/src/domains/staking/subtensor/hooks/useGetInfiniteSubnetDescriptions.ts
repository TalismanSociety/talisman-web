import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'

import { SubnetApiDescriptionsResponse } from '../types'

const TAOSTATS_API_KEY = import.meta.env.VITE_TAOSTATS_API_KEY
const TAOSTATS_API_URL = import.meta.env.VITE_TAOSTATS_API_URL

const fetchSubnetDescriptions = async ({ pageParam = 1 }) => {
  const { data } = await axios.get<SubnetApiDescriptionsResponse>(`${TAOSTATS_API_URL}/api/subnet/description/v1`, {
    params: { page: pageParam },
    method: 'GET',
    headers: {
      Authorization: TAOSTATS_API_KEY,
      'Content-Type': 'application/json',
    },
  })
  return data
}

export function useGetInfiniteSubnetDescriptions() {
  return useInfiniteQuery({
    queryKey: ['infiniteSubnetDescriptions'],
    initialData: {
      pages: [initialData],
      pageParams: [1],
    },
    queryFn: fetchSubnetDescriptions,
    getNextPageParam: lastPage => lastPage.pagination.next_page ?? undefined,
    getPreviousPageParam: firstPage => firstPage.pagination.prev_page ?? undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, // 10 mins
    refetchOnReconnect: true,
  })
}

const initialData: SubnetApiDescriptionsResponse = {
  pagination: {
    current_page: 1,
    next_page: null,
    per_page: 1024,
    prev_page: null,
    total_items: 308,
    total_pages: 1,
  },
  data: [
    {
      netuid: 0,
      bittensor_id: 'NA',
      name: 'Root',
      description:
        'The root network is a meta subnet with id 0. This network determines the proportion of the network’s block emission to be distributed to each subnet network. This is currently set to 1 TAO for every block mined.  Like other subnetworks, the root network consists of a set of validators that set weights (W). These weights are then processed by Yuma Consensus to determine an emission vector (E). The difference is that the vector E has a length equal to the number of active subnetworks currently running on the chain and each e_i in E is the emission proportion that subnet i receives every block. The root network also doubles as the network senate. This senate is the top 12 keys on this network which have been granted veto power on proposals submitted by the triumvirate.',
      hw_requirements: '',
      github: '',
      image_url: '',
    },
    {
      netuid: 1,
      bittensor_id: 'alpha',
      name: 'Apex',
      description: 'This Subnet defines an incentive mechanism to create a distributed conversational AI.',
      hw_requirements: 'https://github.com/macrocosm-os/prompting/blob/main/min_compute.yml',
      github: 'https://github.com/macrocosm-os/prompting',
      image_url: '',
    },
    {
      netuid: 2,
      bittensor_id: 'beta',
      name: 'Omron',
      description: 'Omron subnet, building cryptographically verified efficient and intelligent capital networks.',
      hw_requirements: 'https://github.com/inference-labs-inc/omron-subnet?tab=readme-ov-file#run-the-miner',
      github: 'https://github.com/inference-labs-inc/omron-subnet',
      image_url: '',
    },
    {
      netuid: 3,
      bittensor_id: 'gamma',
      name: 'Templar',
      description:
        'Templar seeks to push the boundaries of the combination incentives and distributing training infrastructure.',
      hw_requirements: '',
      github: 'https://github.com/tplr-ai/templar',
      image_url: '',
    },
    {
      netuid: 4,
      bittensor_id: 'delta',
      name: 'Targon',
      description:
        'TARGON (Bittensor Subnet 4) is a redundant deterministic verification mechanism that can be used to interpret and analyze ground truth sources and a query.',
      hw_requirements: 'https://github.com/manifold-inc/targon#compute-requirements',
      github: 'https://github.com/manifold-inc/targon',
      image_url: '',
    },
    {
      netuid: 5,
      bittensor_id: 'epsilon',
      name: 'Open Kaito',
      description:
        'Kaito AI is committed to democratizing access to Web3 information through its established platform. However, the in-house approach to data collection, indexing, AI training, and ranking imposes operational burdens and stifles broader public innovation.',
      hw_requirements: 'https://github.com/OpenKaito/openkaito/blob/main/min_compute.yml',
      github: 'https://github.com/OpenKaito/openkaito',
      image_url: '',
    },
    {
      netuid: 6,
      bittensor_id: 'zeta',
      name: 'Infinite Games',
      description: 'Incentivizing the prediction of future events.',
      hw_requirements: 'https://github.com/amedeo-gigaver/infinite_games/blob/main/min_compute.yml',
      github: 'https://github.com/amedeo-gigaver/infinite_games',
      image_url: 'https://github.com/amedeo-gigaver/infinite_games/raw/main/docs/infinite-games.jpeg',
    },
    {
      netuid: 7,
      bittensor_id: 'eta',
      name: 'Subvortex',
      description:
        'SubVortex introduces an incentivized and decentralized network of subtensor nodes that are pivotal elements within the Bittensor ecosystem. This delineates the structure, objectives, and mechanisms of SubVortex, aiming to foster decentralization, stability, and efficient resource allocation within the broader Bittensor network.',
      hw_requirements: 'https://github.com/eclipsevortex/SubVortex/blob/main/min_compute.yml',
      github: 'https://github.com/eclipsevortex/SubVortex',
      image_url: '',
    },
    {
      netuid: 8,
      bittensor_id: 'theta',
      name: 'Proprietary Trading Network',
      description:
        "PTN receives signals from quant and deep learning machine learning trading systems to deliver the world's most complete trading signals across a variety of asset classes.",
      hw_requirements: 'https://github.com/taoshidev/proprietary-trading-network/blob/main/docs/miner.md',
      github: 'https://github.com/taoshidev/proprietary-trading-network',
      image_url:
        'https://camo.githubusercontent.com/6f50fcc5d5dee8a6edfbaace39f44d187c3c3a792f62dcc7e2e4819912550e0a/68747470733a2f2f692e696d6775722e636f6d2f356854737039372e706e67',
    },
    {
      netuid: 9,
      bittensor_id: 'iota',
      name: 'Pretraining',
      description:
        'Bittensor subnet 9 rewards miners for producing pretrained Foundation-Models on the Falcon Refined Web dataset.',
      hw_requirements: 'https://github.com/macrocosm-os/pretraining/blob/main/min_compute.yml',
      github: 'https://github.com/macrocosm-os/pretraining',
      image_url: '',
    },
    {
      netuid: 10,
      bittensor_id: 'kappa',
      name: 'Sturdy',
      description:
        'The Sturdy Subnet is a Bittensor subnetwork that enables the creation of decentralized, autonomous yield optimizers.',
      hw_requirements: 'https://github.com/Sturdy-Subnet/sturdy-subnet/blob/main/min_compute.yml',
      github: 'https://github.com/Sturdy-Subnet/sturdy-subnet/',
      image_url: '',
    },
    {
      netuid: 11,
      bittensor_id: 'lambda',
      name: 'Dippy Roleplay',
      description:
        "The Dippy Roleplay subnet on Bittensor aims to create the world's best open-source roleplay LLM by leveraging the collective efforts of the open-source community.",
      hw_requirements: 'https://github.com/impel-intelligence/dippy-bittensor-subnet/blob/main/min_compute.yml',
      github: 'https://github.com/impel-intelligence/dippy-bittensor-subnet',
      image_url: 'https://github.com/impel-intelligence/dippy-bittensor-subnet/raw/main/assests/banner.png',
    },
    {
      netuid: 12,
      bittensor_id: 'mu',
      name: 'Horde',
      description: '',
      hw_requirements: '',
      github: 'https://github.com/backend-developers-ltd/ComputeHorde',
      image_url: 'https://github.com/backend-developers-ltd/ComputeHorde/raw/master/ComputeHorde.png',
    },
    {
      netuid: 13,
      bittensor_id: 'nu',
      name: 'Dataverse',
      description:
        'Data Universe is a Bittensor subnet for collecting and storing large amounts of data from across a wide-range of sources, for use by other Subnets. It was built from the ground-up with a focus on decentralization and scalability.',
      hw_requirements: 'https://github.com/macrocosm-os/data-universe/blob/main/docs/miner.md#system-requirements',
      github: 'https://github.com/macrocosm-os/data-universe/',
      image_url: '',
    },
    {
      netuid: 14,
      bittensor_id: 'xi',
      name: 'VectorStore',
      description:
        'Bittensor Subnet VectorStore: A decentralized network for storing and retrieving vector data (text) to enhance AI.',
      hw_requirements: '',
      github: 'https://github.com/vector-pool/vector-store',
      image_url: '',
    },
    {
      netuid: 15,
      bittensor_id: 'omicron',
      name: 'De-Val',
      description:
        'de_val sets the new benchmark for AI excellence, offering a decentralized evaluation platform designed to enhance LLM performance with unmatched quality. With de_val, you can rigorously test your AI models throughout the ML ops pipeline (offline testing, A/B testing, and continuous monitoring), measuring hallucinations, misattributions, relevancy, and summarization comprehensiveness, so you can understand your outputs at scale and deploy with confidence.',
      hw_requirements: '',
      github: 'https://github.com/deval-core/De-Val',
      image_url: '',
    },
    {
      netuid: 16,
      bittensor_id: 'pi',
      name: 'BitAds',
      description:
        'Revolutionizing Online Advertising with Decentralization. Discover how BitAds leverages the Bittensor Network to offer cost-effective, high-quality advertising through a unique incentive mechanism for miners and validators.',
      hw_requirements: 'https://github.com/eseckft/BitAds.ai/blob/main/min_compute.yml',
      github: 'https://github.com/eseckft/BitAds.ai/',
      image_url: 'https://github.com/eseckft/BitAds.ai/raw/main/docs/bitads.png',
    },
    {
      netuid: 17,
      bittensor_id: 'rho',
      name: 'Three Gen',
      description:
        'This subnet aims to kickstart the next revolution in gaming around AI native games, ultimately leveraging the broader Bittensor ecosystem to facilitate experiences in which assets, voice and sound are all generated at runtime.',
      hw_requirements: 'https://github.com/404-Repo/three-gen-subnet?tab=readme-ov-file#hardware-requirements',
      github: 'https://github.com/404-Repo/three-gen-subnet',
      image_url: '',
    },
    {
      netuid: 18,
      bittensor_id: 'sigma',
      name: 'Cortex.t',
      description:
        'Cortex.t stands at the forefront of artificial intelligence, offering a dual-purpose solution that caters to the needs of app developers and innovators in the AI space. This platform is meticulously designed to deliver reliable, high-quality text and image responses through API usage, utilising the decentralised Bittensor network. It serves as a cornerstone for creating a fair, transparent, and manipulation-free environment for the incentivised production of intelligence (mining) and generation and fulfilment of diverse user prompts.',
      hw_requirements: 'https://github.com/corcel-api/cortex.t/blob/main/min_compute.yml',
      github: 'https://github.com/corcel-api/cortex.t',
      image_url: '',
    },
    {
      netuid: 19,
      bittensor_id: 'tau',
      name: 'Nineteen',
      description:
        'Subnet 19 is a Bittensor subnetwork, focused around inference at scale, with an initial focus on image generation & manipulation models.',
      hw_requirements: 'https://docs.taostats.io/docs/subnet-19-vision#Requirements',
      github: 'https://github.com/namoray/nineteen/',
      image_url: '',
    },
    {
      netuid: 20,
      bittensor_id: 'upsilon',
      name: 'BitAgent - Rizzo',
      description:
        'BitAgent revolutionizes how you manage tasks and workflows across platforms, merging the capabilities of large language models (LLMs) with the convenience of your favorite apps such as web browsers, Discord, and custom integrations. BitAgent empowers users to seamlessly integrate intelligent agents, providing personalized assistance and integrated task automation.',
      hw_requirements: 'https://github.com/RogueTensor/bitagent_subnet/blob/main/min_compute.yml',
      github: 'https://github.com/RogueTensor/bitagent_subnet',
      image_url: '',
    },
    {
      netuid: 21,
      bittensor_id: 'phi',
      name: 'Omega Any-to-any',
      description:
        'OMEGA Any-to-Any is a decentralized, open-source AI project built on the Bittensor blockchain by OMEGA Labs. ',
      hw_requirements: '',
      github: 'https://github.com/omegalabsinc/omegalabs-anytoany-bittensor',
      image_url: 'https://github.com/omegalabsinc/omegalabs-anytoany-bittensor/raw/main/galactic_a2a.png',
    },
    {
      netuid: 22,
      bittensor_id: 'chi',
      name: 'Desearch',
      description:
        'Welcome to Desearch, the AI-powered search engine built on Bittensor. Designed for the Bittensor community and general internet users, Desearch delivers an unbiased and verifiable search experience. Through our API, developers and AI builders are empowered to integrate AI search capabilities into their products, with access to metadata from platforms like X, Reddit, Arxiv and general web search.',
      hw_requirements: '',
      github: 'https://github.com/datura-ai/smart-scrape',
      image_url: '',
    },
    {
      netuid: 23,
      bittensor_id: 'psi',
      name: 'SocialTensor',
      description:
        'NicheImage is a decentralized network that utilizes the Bittensor protocol to enable distributed image generation.',
      hw_requirements: 'https://docs.taostats.io/docs/subnet-23-niche-image#setup-instructions-for-miners',
      github: 'https://github.com/NicheTensor/NicheImage',
      image_url: '',
    },
    {
      netuid: 24,
      bittensor_id: 'omega',
      name: 'Omega',
      description:
        "Welcome to the OMEGA Labs Bittensor subnet, a groundbreaking initiative that aims to create the world's largest decentralized multimodal dataset for accelerating Artificial General Intelligence (AGI) research and development. Our mission is to democratize access to a vast and diverse dataset that captures the landscape of human knowledge and creation, empowering researchers and developers to push the boundaries of AGI.",
      hw_requirements: 'https://github.com/omegalabsinc/omegalabs-bittensor-subnet/blob/main/min_compute.yml',
      github: 'https://github.com/omegalabsinc/omegalabs-bittensor-subnet',
      image_url: 'https://github.com/omegalabsinc/omegalabs-bittensor-subnet/raw/main/docs/galacticlandscape.png',
    },
    {
      netuid: 25,
      bittensor_id: 'alef',
      name: 'Protein Folding',
      description: '',
      hw_requirements: 'https://github.com/macrocosm-os/folding/blob/main/min_compute.yml',
      github: 'https://github.com/macrocosm-os/folding',
      image_url: 'https://github.com/macrocosm-os/folding/raw/main/assets/macrocosmos-white.png',
    },
    {
      netuid: 26,
      bittensor_id: 'bet',
      name: 'Tensor Alchemy',
      description: 'Human Scoring and Decentralized Image Generation on Bittensor',
      hw_requirements: 'https://docs.google.com/document/d/1FzZe5EskEV0Q6BkOuVkqCrIEexzQZd_134eT74B7hPA/edit',
      github: 'https://github.com/TensorAlchemy/TensorAlchemy',
      image_url: '',
    },
    {
      netuid: 27,
      bittensor_id: 'gimel',
      name: 'Compute',
      description:
        'This repository serves as a compute-composable subnet, integrating various cloud platforms (e.g., Runpod, Lambda, AWS) into a cohesive unit. Its purpose is to enable higher-level cloud platforms to offer seamless compute composability across different underlying platforms. ',
      hw_requirements: '',
      github: 'https://github.com/neuralinternet/compute-subnet',
      image_url: '',
    },
    {
      netuid: 28,
      bittensor_id: 'dalet',
      name: 'Unknown',
      description: '',
      hw_requirements: '',
      github: '',
      image_url: '',
    },
    {
      netuid: 29,
      bittensor_id: 'he',
      name: 'Coldint',
      description: 'Bittensor COLaborative Destributed INcentivized Training (coldint) Subnet.',
      hw_requirements: 'https://github.com/coldint/coldint_validator/blob/main/min_compute.yml',
      github: 'https://github.com/coldint',
      image_url: '',
    },
    {
      netuid: 30,
      bittensor_id: 'wav',
      name: 'Bettensor',
      description:
        'Bettensor is a sports prediction subnet. The goal of Bettensor is to provide a platform for sports fans to predict the outcomes of their favorite sporting events, and ML/AI researchers to develop new models and strategies to benchmark against good, old fashioned human intelligence and intuition',
      hw_requirements: 'https://github.com/Bettensor/bettensor/blob/main/min_compute.yml',
      github: 'https://github.com/Bettensor/bettensor',
      image_url: 'https://github.com/Bettensor/bettensor/raw/main/docs/assets/bettensor-twitter-header.jpg',
    },
    {
      netuid: 31,
      bittensor_id: 'zayin',
      name: 'NAS Chain',
      description:
        'Neural Architecture Search (NAS) is a critical field in machine learning that focuses on automating the design of artificial neural network architectures.',
      hw_requirements: 'https://github.com/neuronlogic/NASChain/blob/main/min_compute.yml',
      github: 'https://github.com/neuronlogic/NASChain',
      image_url: 'https://github.com/neuronlogic/NASChain/raw/main/imgs/naschain_logo.png',
    },
    {
      netuid: 32,
      bittensor_id: 'chet',
      name: "It's AI",
      description:
        "Our subnet focuses on the detection of AI-generated content. Given the rapid growth of LLM-generated text, such as ChatGPT's output of 100 billion words daily compared to humans' 100 trillion, we believe that the ability to accurately determine AI-generated text will become increasingly necessary.",
      hw_requirements: 'https://github.com/It-s-AI/llm-detection/blob/main/min_compute.yml',
      github: 'https://github.com/It-s-AI/llm-detection',
      image_url: '',
    },
    {
      netuid: 33,
      bittensor_id: 'tet',
      name: 'ReadyAI',
      description:
        'ReadyAI (readyai.ai) enables structured data processing at scale, democratizing access to the valuable digital commodity of structured data  – the key ingredient for high quality fine tuned models and RAG solutions.',
      hw_requirements:
        'https://github.com/afterpartyai/bittensor-conversation-genome-project/blob/main/min_compute.yml',
      github: 'https://github.com/afterpartyai/bittensor-conversation-genome-project',
      image_url: '',
    },
    {
      netuid: 34,
      bittensor_id: 'yod',
      name: 'BitMind',
      description: 'Identifying AI-Generated Media with a Decentralized Framework',
      hw_requirements: 'https://github.com/BitMind-AI/bitmind-subnet/blob/main/min_compute.yml',
      github: 'https://github.com/BitMind-AI/bitmind-subnet',
      image_url: 'https://github.com/BitMind-AI/bitmind-subnet/raw/main/static/Bitmind-Logo.png',
    },
    {
      netuid: 35,
      bittensor_id: 'kaf',
      name: 'LogicNet',
      description:
        'LogicNet is a decentralized network utilizing the Bittensor protocol for advanced AI/ML model development focused on mathematics, computational thinking, and data analysis. ',
      hw_requirements: 'https://github.com/LogicNet-Subnet/LogicNet-prodblob/main/min_compute.yml',
      github: 'https://github.com/LogicNet-Subnet/LogicNet',
      image_url: '',
    },
    {
      netuid: 36,
      bittensor_id: 'lamed',
      name: '',
      description: '',
      hw_requirements: '',
      github: '',
      image_url: '',
    },
    {
      netuid: 37,
      bittensor_id: 'mem',
      name: 'Finetuning',
      description: 'The Finetuning subnet 37 rewards miners for fine-tuning Large Language Models (LLMs).',
      hw_requirements: 'https://github.com/macrocosm-os/finetuning/blob/main/min_compute.yml',
      github: 'https://github.com/macrocosm-os/finetuning',
      image_url: 'https://github.com/macrocosm-os/finetuning/raw/main/assets/macrocosmos-white.png',
    },
    {
      netuid: 38,
      bittensor_id: 'nun',
      name: 'Distributed Training Subnet',
      description:
        'A bittensor subnetwork that incentivizes miners to provide compute, bandwidth and latency in order to train a single LLM.',
      hw_requirements: 'https://github.com/KMFODA/DistributedTraining/blob/main/min.compute.yml',
      github: 'https://github.com/KMFODA/DistributedTraining',
      image_url: '',
    },
    {
      netuid: 39,
      bittensor_id: 'samekh',
      name: 'EdgeMaxxing',
      description: 'WOMBO EdgeMaxxing Subnet: Optimizing AI Models for Consumer Devices',
      hw_requirements: '',
      github: 'https://github.com/womboai/edge-optimization-subnet',
      image_url:
        'https://camo.githubusercontent.com/8dee96c4061d56aa6940f9fa2cdb88139772459450fde3cc27876aaa0f8bbc57/68747470733a2f2f636f6e74656e742e776f6d626f2e61692f62697474656e736f722f534e33395f636f7665722e6a706567',
    },
    {
      netuid: 40,
      bittensor_id: 'final-nun',
      name: 'Chunking',
      description:
        'This subnet is designed to advance the field of Retrieval-Augmented Generation (RAG) by incentivizing the development and service of sophisticated chunking solutions.',
      hw_requirements: 'https://github.com/VectorChat/chunking_subnet/blob/main/min_compute.yml',
      github: 'https://github.com/VectorChat/chunking_subnet',
      image_url: 'https://github.com/VectorChat/chunking_subnet/raw/main/assets/title.png',
    },
    {
      netuid: 41,
      bittensor_id: 'nun',
      name: 'Sportstensor',
      description:
        "Sportstensor is pioneering the world's most accurate decentralized sports prediction algorithm, built on the Bittensor network.",
      hw_requirements: 'https://github.com/xzistance/sportstensor/blob/main/min_compute.yml',
      github: 'https://github.com/sportstensor/sportstensor',
      image_url: 'https://github.com/xzistance/sportstensor/raw/main/docs/sportstensor_header.png',
    },
    {
      netuid: 42,
      bittensor_id: 'samekh',
      name: 'Real-Time Data by Masa',
      description:
        'Subnet 42 by Masa provides real-time, structured, and high-quality data for AI Agents and Application builders.',
      hw_requirements: '',
      github: 'https://github.com/masa-finance/masa-bittensor',
      image_url: '',
    },
    {
      netuid: 43,
      bittensor_id: 'ayin',
      name: 'Graphite',
      description:
        'A decentralized network for solving graph optimization problems, built on Bittensor, the foremost decentralised AI network.',
      hw_requirements: 'https://github.com/GraphiteAI/Graphite-Subnet/blob/main/min_compute.yml',
      github: 'https://github.com/GraphiteAI/Graphite-Subnet',
      image_url: 'https://github.com/GraphiteAI/Graphite-Subnet/raw/main/static/banner.png',
    },
    {
      netuid: 44,
      bittensor_id: 'final-pe',
      name: 'Score',
      description:
        'Score Predict is a Bittensor subnet designed to incentivize accurate football (soccer) match predictions.',
      hw_requirements: 'https://github.com/score-protocol/score-predict/blob/main/min_compute.yml',
      github: 'https://github.com/score-technologies/score-vision',
      image_url: '',
    },
    {
      netuid: 45,
      bittensor_id: 'pe',
      name: 'Gen42 - Rizzo',
      description: 'Gen42 leverages the Bittensor network to provide decentralized code generation services. ',
      hw_requirements: '',
      github: 'https://github.com/brokespace/code/',
      image_url: '',
    },
    {
      netuid: 46,
      bittensor_id: 'final-tsadi',
      name: 'NeuralAI',
      description:
        'NeuralAI is a Bittensor subnet dedicated to the generation of 3D models using advanced neural network techniques. Our goal is to allow developers and artists access to tools that simplify the creation of high-quality 3D assets for various applications, including gaming, virtual reality, and simulations.',
      hw_requirements: '',
      github: 'https://github.com/GoNeuralAI/neural-subnet',
      image_url:
        'https://camo.githubusercontent.com/76d438c5a5024517e52c52c750f92bfcf25ff88bd2b611e3280bb86c7ea02db7/68747470733a2f2f7062732e7477696d672e636f6d2f70726f66696c655f62616e6e6572732f313736333838303232383536373236393337362f313732323534313230302f3135303078353030',
    },
    {
      netuid: 47,
      bittensor_id: 'tsadi',
      name: 'Condense AI',
      description:
        'Accelerating AI inference by compressing long sequences of natural language tokens into soft-tokens, reducing computational cost and inference time.',
      hw_requirements: '',
      github: 'https://github.com/condenses/neural-condense-subnet',
      image_url: 'https://github.com/condenses/neural-condense-subnet/raw/main/assets/images/condense-main.png',
    },
    {
      netuid: 48,
      bittensor_id: '',
      name: 'Nextplace AI',
      description:
        'Nextplace AI is decentralizing intelligence around housing markets. In a space controlled by monopolies and gatekeepers, Nexplace seeks to provide a democratized network to evaluate home prices for everybody.',
      hw_requirements: '',
      github: 'https://github.com/Nickel5-Inc/Nextplace',
      image_url: '',
    },
    {
      netuid: 49,
      bittensor_id: 'resh',
      name: 'Hivetrain AutoML',
      description:
        'A collaborative platform dedicated to revolutionizing deep learning by automating the discovery of improved and novel neural network components.',
      hw_requirements: '',
      github: 'https://github.com/Hivetrain/DistributedAutoML/',
      image_url: '',
    },
    {
      netuid: 50,
      bittensor_id: 'shin',
      name: 'Synth',
      description:
        "Synth is a Bittensor Subnet, developed by Mode, leverages Bittensor’s decentralized intelligence network to create the world's most powerful synthetic data for price forecasting. Such price forecasting will be used to power the agentic economy onchain. Unlike traditional price prediction systems that focus on single-point forecasts, Synth specializes in capturing the full distribution of possible price movements and their associated probabilities, to build the most accurate synthetic data in the world, starting with BTC.",
      hw_requirements: '',
      github: 'https://github.com/mode-network/synth-subnet',
      image_url: '',
    },
    {
      netuid: 51,
      bittensor_id: 'tav',
      name: 'Compute Subnet',
      description:
        'This project enables a decentralized, peer-to-peer GPU rental marketplace, connecting miners who contribute GPU resources with users who need computational power.',
      hw_requirements: '',
      github: 'https://github.com/Datura-ai/compute-subnet',
      image_url: '',
    },
    {
      netuid: 52,
      bittensor_id: 'alif',
      name: 'Dojo',
      description: 'Crowdsource high-quality human-generated datasets.',
      hw_requirements: '',
      github: 'https://github.com/tensorplex-labs/dojo',
      image_url: 'https://github.com/tensorplex-labs/dojo/raw/main/assets/dojo.png',
    },
    {
      netuid: 53,
      bittensor_id: 'ba',
      name: 'Efficient Frontier',
      description:
        'Our mission is to identify optimal, risk-weighted trading strategies by integrating decentralized machine learning networks with live trading data.',
      hw_requirements: '',
      github: 'https://github.com/EfficientFrontier-SignalPlus/EfficientFrontier',
      image_url: '',
    },
    {
      netuid: 54,
      bittensor_id: 'ta',
      name: 'WebGenieAI',
      description:
        'WebGenieAI Subnet is a pioneering Bittensor-based subnet designed to revolutionize project generation through advanced AI models. WebGenieAI aims to transform diverse prompts—ranging from texts to concept sketches and images into fully functional, ready-to-deploy projects. This subnet is tailored for developers, designers, and innovators who seek to accelerate their project development process with high-quality, AI-generated outputs.',
      hw_requirements: 'https://github.com/web-genie-ai/web-genie-ai/blob/main/min_compute.yml',
      github: 'https://github.com/web-genie-ai/web-genie-ai',
      image_url:
        'https://raw.githubusercontent.com/web-genie-ai/web-genie-ai/f7efa10d3eaadded7757a25510f10f628a16361c/Web-Genie-logo.png',
    },
    {
      netuid: 55,
      bittensor_id: 'tha',
      name: 'Precog',
      description:
        'Precog is an AI-powered high-frequency $BTC price forecasting subnet underpinned by Coin Metrics’ comprehensive and trusted data. Miners produce financial intelligence utilizing the same datasets which power the most prestigious institutions touching cryptoassets.',
      hw_requirements: '',
      github: 'https://github.com/coinmetrics/precog',
      image_url: '',
    },
    {
      netuid: 56,
      bittensor_id: 'djim',
      name: 'Gradients',
      description: 'Anyone Can Train on Bittensor - Gradients on Demand.',
      hw_requirements: '',
      github: 'https://github.com/rayonlabs/G.O.D',
      image_url: '',
    },
    {
      netuid: 57,
      bittensor_id: 'ha',
      name: 'Gaia',
      description: 'Gaia is the hub of geospatial AI on Bittensor',
      hw_requirements: '',
      github: 'https://github.com/Nickel5-Inc/Gaia',
      image_url: '',
    },
    {
      netuid: 58,
      bittensor_id: 'rro',
      name: 'Dippy Speech',
      description:
        'Developing the world’s most advanced open-source Speech model for immersive, lifelike interactions.',
      hw_requirements: '',
      github: 'https://github.com/impel-intelligence/dippy-speech-subnet',
      image_url: '',
    },
    {
      netuid: 59,
      bittensor_id: 'dal',
      name: 'Agent Arena by Masa',
      description:
        'Welcome to Agent Arena by Masa - the first competitive agent ecosystem where market forces and real engagement drive the evolution of sentient AI agents.',
      hw_requirements: '',
      github: 'https://github.com/masa-finance/agent-arena-subnet',
      image_url: '',
    },
    {
      netuid: 60,
      bittensor_id: 'dhal',
      name: 'Bitsec',
      description: 'Bitsec is an ecosystem for AI-powered code vulnerability detection.',
      hw_requirements: '',
      github: 'https://github.com/Bitsec-AI/subnet',
      image_url: '',
    },
    {
      netuid: 61,
      bittensor_id: 'ra',
      name: 'Red Team',
      description:
        'The RedTeam subnet by Innerworks is a decentralized platform designed to drive innovation in cybersecurity through competitive programming challenges.',
      hw_requirements: '',
      github: 'https://github.com/RedTeamSubnet/RedTeam',
      image_url: '',
    },
    {
      netuid: 62,
      bittensor_id: 'zai',
      name: 'AgenTao',
      description:
        'AgenTao is an initiative to create a decentralized, self-sustaining marketplace of autonomous software engineering agents. Our mission is to incentivize autonomous SWE agents to tackle real-world software problems, solving increasingly complex and general tasks.',
      hw_requirements: '',
      github: 'https://github.com/taoagents/agentao',
      image_url: '',
    },
    {
      netuid: 63,
      bittensor_id: 'sin',
      name: 'Finesτ Daτa',
      description:
        'The Finesτ Daτa subnet is designed to generate high-quality, decentralized datasets to support AI model training. By leveraging the Bittensor network, the subnet ensures that dataset creation, refinement, and validation are performed in a decentralized and transparent manner.',
      hw_requirements: 'https://github.com/elevonix-labs/finest-data-subnet/blob/main/min_compute.yml',
      github: 'https://github.com/elevonix-labs/finest-data-subnet',
      image_url: 'https://github.com/elevonix-labs/finest-data-subnet/blob/main/docs/GitHub%20Banner.jpg',
    },
    {
      netuid: 64,
      bittensor_id: 'shin',
      name: 'Chutes',
      description: 'Serverless AI compute. Run any AI model',
      hw_requirements: '',
      github: 'https://github.com/rayonlabs/chutes',
      image_url: '',
    },
  ],
}
