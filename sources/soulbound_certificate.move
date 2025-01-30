module edu_mint_addr::soulbound_certificate {
    use std::string::{Self, String};
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_token::token;
    use aptos_framework::signer;
    use std::vector;

    struct CertificateCollection has key {
        collection_name: String,
        mint_events: EventHandle<MintCertificateEvent>,
    }

    struct MintCertificateEvent has drop, store {
        recipient: address,
        token_name: String,
        course: String,
        score: u64,
        video_progress: u64,
    }

    const COLLECTION_NAME: vector<u8> = b"EduMint Certificates";
    const COLLECTION_DESCRIPTION: vector<u8> = b"EduMint Soulbound Certificates";
    const IMAGE_URL: vector<u8> = b"https://m.media-amazon.com/images/I/71hI16-vr6L.jpg";

    const ENOT_INITIALIZED: u64 = 1;
    const EINSUFFICIENT_PROGRESS: u64 = 100;

    public entry fun init_collection(creator: &signer) {
        let creator_addr = signer::address_of(creator);
        assert!(!exists<CertificateCollection>(creator_addr), 0);

        let collection_name = string::utf8(COLLECTION_NAME);
        let description = string::utf8(COLLECTION_DESCRIPTION);
        let uri = string::utf8(IMAGE_URL);

        token::create_collection(
            creator,
            collection_name,
            description,
            uri,
            0, // maximum supply
            vector<bool>[false, false, false], // mutable description, URI, and supply
        );

        move_to(creator, CertificateCollection {
            collection_name: collection_name,
            mint_events: account::new_event_handle<MintCertificateEvent>(creator),
        });
    }

    public entry fun mint_certificate(
        creator: &signer,
        recipient: &signer,
        course: String,
        score: u64,
        video_progress: u64,
    ) acquires CertificateCollection {
        let creator_addr = signer::address_of(creator);
        assert!(exists<CertificateCollection>(creator_addr), ENOT_INITIALIZED);
        assert!(video_progress >= 75, EINSUFFICIENT_PROGRESS);

        let collection = borrow_global_mut<CertificateCollection>(creator_addr);
        let token_name = course;
        let description = string::utf8(b"Certificate for course completion: ");
        string::append(&mut description, copy course);
        let token_uri = string::utf8(IMAGE_URL);

        let token_data_id = token::create_tokendata(
            creator,
            collection.collection_name,
            token_name,
            description,
            1, // maximum (soulbound)
            token_uri,
            creator_addr, // royalty payee address
            0, // royalty points denominator
            0, // royalty points numerator
            token::create_token_mutability_config(
                &vector<bool>[false, false, false, false, false]
            ),
            vector<String>[string::utf8(b"score"), string::utf8(b"video_progress")],
            vector<vector<u8>>[to_bytes(&score), to_bytes(&video_progress)],
            vector<String>[string::utf8(b"u64"), string::utf8(b"u64")],
        );

        let token = token::mint_token(creator, token_data_id, 1);
        token::direct_transfer(creator, recipient, token, 1);

        event::emit_event(&mut collection.mint_events, MintCertificateEvent {
            recipient: signer::address_of(recipient),
            token_name,
            course,
            score,
            video_progress,
        });
    }

    #[view]
    public fun get_collection_info(creator_addr: address): (String, String, String) acquires CertificateCollection {
        let collection = borrow_global<CertificateCollection>(creator_addr);
        (
            collection.collection_name,
            string::utf8(COLLECTION_DESCRIPTION),
            string::utf8(IMAGE_URL)
        )
    }

    fun to_bytes(value: &u64): vector<u8> {
        let bytes = vector::empty<u8>();
        let i = 0;
        while (i < 8) {
            vector::push_back(&mut bytes, ((*value >> ((7 - i) * 8)) & 0xff) as u8);
            i = i + 1;
        };
        bytes
    }
}

