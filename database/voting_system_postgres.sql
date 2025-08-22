
-- =============================
-- Online Voting System (PIN-based)
-- PostgreSQL schema
-- =============================

DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS pins CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS elections CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Admins table
CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Elections table
CREATE TABLE elections (
    election_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft','open','closed')),
    created_by INT REFERENCES admins(admin_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts/Positions (linked to election)
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    election_id INT REFERENCES elections(election_id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidates (linked to post + election)
CREATE TABLE candidates (
    candidate_id SERIAL PRIMARY KEY,
    election_id INT REFERENCES elections(election_id) ON DELETE CASCADE,
    post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    photo_url TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PINs (manual issue by admin)
CREATE TABLE pins (
    pin_id SERIAL PRIMARY KEY,
    election_id INT REFERENCES elections(election_id) ON DELETE CASCADE,
    pin_hash TEXT NOT NULL, -- store hash only, not plaintext
    assigned_to_name VARCHAR(200),
    assigned_to_roll VARCHAR(100),
    room_no VARCHAR(50),
    issued_by INT REFERENCES admins(admin_id) ON DELETE SET NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Votes (linked to PIN + post + candidate)
CREATE TABLE votes (
    vote_id SERIAL PRIMARY KEY,
    election_id INT REFERENCES elections(election_id) ON DELETE CASCADE,
    post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
    candidate_id INT REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    pin_id INT REFERENCES pins(pin_id) ON DELETE CASCADE,
    cast_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    extra_data JSONB DEFAULT '{}'::jsonb,
    UNIQUE(post_id, pin_id) -- ensures 1 vote per PIN per post
);

-- Function to add PIN (admin supplies plaintext, DB hashes it)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION admin_add_pin(
    election INT,
    plaintext TEXT,
    room TEXT,
    roll TEXT,
    student_name TEXT,
    issuer INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO pins(election_id, pin_hash, assigned_to_name, assigned_to_roll, room_no, issued_by)
    VALUES(election, crypt(plaintext, gen_salt('bf')), student_name, roll, room, issuer);
END;
$$ LANGUAGE plpgsql;

-- Function to cast vote (check election open, pin valid, unused)
CREATE OR REPLACE FUNCTION cast_vote(
    election INT,
    post INT,
    candidate INT,
    plaintext TEXT,
    extra JSONB DEFAULT '{}'::jsonb
) RETURNS TEXT AS $$
DECLARE
    pin_record RECORD;
BEGIN
    -- check election open
    IF (SELECT status FROM elections WHERE election_id=election) <> 'open' THEN
        RETURN 'Election not open';
    END IF;

    -- find pin
    SELECT * INTO pin_record FROM pins WHERE election_id=election AND is_used=false AND crypt(plaintext, pin_hash)=pin_hash LIMIT 1;

    IF NOT FOUND THEN
        RETURN 'Invalid or already used PIN';
    END IF;

    -- mark pin as used
    UPDATE pins SET is_used=true WHERE pin_id=pin_record.pin_id;

    -- insert vote
    INSERT INTO votes(election_id, post_id, candidate_id, pin_id, extra_data)
    VALUES(election, post, candidate, pin_record.pin_id, extra);

    RETURN 'Vote cast successfully';
END;
$$ LANGUAGE plpgsql;

-- Function to open/close election
CREATE OR REPLACE FUNCTION admin_set_election_status(elec INT, newstatus TEXT) RETURNS VOID AS $$
BEGIN
    UPDATE elections SET status=newstatus, updated_at=NOW() WHERE election_id=elec;
END;
$$ LANGUAGE plpgsql;

-- Turnout (safe real-time stats: used/unused only)
CREATE OR REPLACE FUNCTION get_turnout(elec INT)
RETURNS TABLE(total_pins INT, used INT, unused INT) AS $$
BEGIN
    RETURN QUERY
    SELECT COUNT(*), COUNT(*) FILTER (WHERE is_used), COUNT(*) FILTER (WHERE NOT is_used)
    FROM pins WHERE election_id=elec;
END;
$$ LANGUAGE plpgsql;

-- Safe results (only after closed)
CREATE OR REPLACE FUNCTION get_results_if_closed(elec INT)
RETURNS TABLE(post_id INT, candidate_id INT, candidate_name TEXT, votes INT) AS $$
BEGIN
    IF (SELECT status FROM elections WHERE election_id=elec) <> 'closed' THEN
        RAISE EXCEPTION 'Election not closed yet';
    END IF;

    RETURN QUERY
    SELECT v.post_id, c.candidate_id, c.name, COUNT(v.vote_id)
    FROM votes v
    JOIN candidates c ON v.candidate_id=c.candidate_id
    WHERE v.election_id=elec
    GROUP BY v.post_id, c.candidate_id, c.name
    ORDER BY v.post_id, votes DESC;
END;
$$ LANGUAGE plpgsql;

-- View: results per post (only valid if election closed)
CREATE OR REPLACE VIEW v_results_by_post_closed AS
SELECT e.election_id, p.post_id, p.name AS post_name, c.candidate_id, c.name AS candidate_name, COUNT(v.vote_id) AS total_votes
FROM elections e
JOIN posts p ON e.election_id=p.election_id
JOIN candidates c ON p.post_id=c.post_id
LEFT JOIN votes v ON c.candidate_id=v.candidate_id
WHERE e.status='closed'
GROUP BY e.election_id, p.post_id, p.name, c.candidate_id, c.name
ORDER BY e.election_id, p.post_id, total_votes DESC;
